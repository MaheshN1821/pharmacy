from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, func
from datetime import datetime, timedelta
from .database import get_db, engine, Base
from .models import Medicine, Sale, PurchaseOrder, determine_medicine_status
from .schemas import (
    MedicineCreate, MedicineUpdate, Medicine as MedicineSchema,
    SaleCreate, Sale as SaleSchema,
    PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrder as PurchaseOrderSchema,
    DashboardSummary
)

app = FastAPI(title="Pharmacy EMR API", version="1.0.0")

# Create all tables
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pharmacy-emr-umber.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== DASHBOARD ENDPOINTS ==============

@app.get("/api/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary including sales, items sold, and stock info."""
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    # Total sales today
    sales_today = db.query(func.sum(Sale.total_price)).filter(
        and_(Sale.sale_date >= today_start, Sale.sale_date <= today_end)
    ).scalar() or 0.0
    
    # Items sold today
    items_sold = db.query(func.sum(Sale.quantity_sold)).filter(
        and_(Sale.sale_date >= today_start, Sale.sale_date <= today_end)
    ).scalar() or 0
    
    # Low stock items
    low_stock = db.query(func.count(Medicine.id)).filter(
        Medicine.stock_quantity <= Medicine.reorder_level
    ).scalar() or 0
    
    # Pending purchase orders
    pending_orders = db.query(func.count(PurchaseOrder.id)).filter(
        PurchaseOrder.status.in_(["pending", "partial"])
    ).scalar() or 0
    
    total_orders = db.query(func.count(PurchaseOrder.id)).scalar() or 0
    pending_orders = db.query(func.count(PurchaseOrder.id)).filter(
        PurchaseOrder.status.in_(["pending","partial"])
    ).scalar() or 0
    total_value = db.query(func.sum(PurchaseOrder.total_cost)).scalar() or 0.0

    return DashboardSummary(
        total_sales_today=float(sales_today),
        items_sold_today=int(items_sold),
        low_stock_items=int(low_stock),
        total_purchase_orders=int(total_orders),
        pending_purchase_orders=int(pending_orders),
        purchase_order_value=float(total_value),
    )

@app.get("/api/dashboard/low-stock", response_model=list[MedicineSchema])
def get_low_stock_items(db: Session = Depends(get_db)):
    """Get list of medicines with stock below reorder level."""
    items = db.query(Medicine).filter(
        Medicine.stock_quantity <= Medicine.reorder_level
    ).order_by(desc(Medicine.reorder_level - Medicine.stock_quantity)).all()
    return items

@app.get("/api/dashboard/recent-sales", response_model=list[SaleSchema])
def get_recent_sales(limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db)):
    """Get recent sales transactions."""
    sales = db.query(Sale).order_by(desc(Sale.sale_date)).limit(limit).all()
    return sales

@app.get("/api/dashboard/pending-orders", response_model=list[PurchaseOrderSchema])
def get_pending_orders(db: Session = Depends(get_db)):
    """Get pending and partial purchase orders."""
    orders = db.query(PurchaseOrder).filter(
        PurchaseOrder.status.in_(["pending", "partial"])
    ).order_by(desc(PurchaseOrder.order_date)).all()
    return orders

# ============== INVENTORY ENDPOINTS ==============

@app.get("/api/inventory", response_model=list[MedicineSchema])
def list_medicines(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str = Query("", min_length=0),
    db: Session = Depends(get_db)
):
    """List all medicines with optional search and pagination."""
    query = db.query(Medicine)
    
    if search:
        query = query.filter(
            Medicine.name.ilike(f"%{search}%") |
            Medicine.medicine_code.ilike(f"%{search}%")
        )
    
    medicines = query.offset(skip).limit(limit).all()
    return medicines

@app.get("/api/inventory/{medicine_id}", response_model=MedicineSchema)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    """Get specific medicine by ID."""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    medicine.status = determine_medicine_status(medicine)
    return medicine

@app.post("/api/inventory", response_model=MedicineSchema, status_code=201)
def create_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    """Create a new medicine."""
    # Check if medicine code already exists
    existing = db.query(Medicine).filter(Medicine.medicine_code == medicine.medicine_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Medicine code already exists")
    
    db_medicine = Medicine(**medicine.dict())
    db_medicine.status = determine_medicine_status(db_medicine)
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@app.put("/api/inventory/{medicine_id}", response_model=MedicineSchema)
def update_medicine(medicine_id: int, medicine_update: MedicineUpdate, db: Session = Depends(get_db)):
    """Update a medicine."""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    update_data = medicine_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medicine, key, value)
    
    medicine.status = determine_medicine_status(medicine)
    medicine.updated_at = datetime.utcnow()
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine

@app.delete("/api/inventory/{medicine_id}", status_code=204)
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    """Delete a medicine."""
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    db.delete(medicine)
    db.commit()
    return None

# ============== SALES ENDPOINTS ==============

@app.post("/api/sales", response_model=SaleSchema, status_code=201)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    """Create a new sale transaction."""
    medicine = db.query(Medicine).filter(Medicine.id == sale.medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    if medicine.stock_quantity < sale.quantity_sold:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    total_price = medicine.price_per_unit * sale.quantity_sold
    db_sale = Sale(
        medicine_id=sale.medicine_id,
        quantity_sold=sale.quantity_sold,
        total_price=total_price,
        customer_name=sale.customer_name,
        notes=sale.notes
    )
    
    medicine.stock_quantity -= sale.quantity_sold
    
    medicine.status = determine_medicine_status(medicine)
    db.add(db_sale)
    db.add(medicine)
    db.commit()
    db.refresh(db_sale)
    return db_sale

# ============== PURCHASE ORDER ENDPOINTS ==============

@app.post("/api/purchase-orders", response_model=PurchaseOrderSchema, status_code=201)
def create_purchase_order(order: PurchaseOrderCreate, db: Session = Depends(get_db)):
    """Create a new purchase order."""
    medicine = db.query(Medicine).filter(Medicine.id == order.medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    db_order = PurchaseOrder(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.put("/api/purchase-orders/{order_id}", response_model=PurchaseOrderSchema)
def update_purchase_order(order_id: int, order_update: PurchaseOrderUpdate, db: Session = Depends(get_db)):
    """Update a purchase order."""
    purchase_order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not purchase_order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    update_data = order_update.dict(exclude_unset=True)
    
    # If receiving items, update medicine stock
    if "quantity_received" in update_data and update_data["quantity_received"] is not None:
        difference = update_data["quantity_received"] - purchase_order.quantity_received
        medicine = db.query(Medicine).filter(Medicine.id == purchase_order.medicine_id).first()
        medicine.stock_quantity += difference
        medicine.status = determine_medicine_status(medicine)
        db.add(medicine)
    
    for key, value in update_data.items():
        setattr(purchase_order, key, value)
    
    purchase_order.updated_at = datetime.utcnow()
    db.add(purchase_order)
    db.commit()
    db.refresh(purchase_order)
    return purchase_order

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Pharmacy EMR API is running"}

@app.get("/")
def default():
    """default endpoint."""
    return {"status": "ok", "message": "Pharmacy EMR API is running"}

app = app