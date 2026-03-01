"""
Database initialization script
Run once to create tables and seed sample data.

Usage:
    python backend/init_db.py
"""

from datetime import datetime, timedelta, date
import random
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import os
from dotenv import load_dotenv

load_dotenv()
# ===============================
# DATABASE CONFIG
# ===============================

DATABASE_URL = os.getenv("DATABASE_URL")  # Change if using PostgreSQL

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


# ===============================
# MODELS (DO NOT CHANGE TABLE NAMES)
# ===============================

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    medicine_code = Column(String(100), unique=True, index=True, nullable=False)
    manufacturer = Column(String)
    stock_quantity = Column(Integer, default=0)
    reorder_level = Column(Integer, default=10)
    price_per_unit = Column(Float,nullable=False)
    batch_number = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Extra fields required for UI
    generic_name = Column(String)
    category = Column(String)
    expiry_date = Column(DateTime)
    cost_price = Column(Float)
    mrp = Column(Float)
    supplier_name = Column(String)
    status = Column(String, default="active")

    sales = relationship("Sale", back_populates="medicine")
    purchase_orders = relationship("PurchaseOrder", back_populates="medicine")

 
class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"),nullable=False)
    quantity_sold = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    customer_name = Column(String(255))
    sale_date = Column(DateTime, default=datetime.utcnow, index=True)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Extra fields
    invoice_number = Column(String, unique=True, nullable=False)
    payment_method = Column(String)  # cash, card, UPI
    status = Column(String, default="completed")

    medicine = relationship("Medicine", back_populates="sales")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    quantity_ordered = Column(Integer, nullable=False)
    quantity_received = Column(Integer, default=0)
    supplier_name = Column(String(255))
    order_date = Column(DateTime, default=datetime.utcnow)
    expected_delivery = Column(DateTime)
    actual_delivery = Column(DateTime, nullable=True)
    status = Column(String, default="pending")
    total_cost = Column(Float)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    medicine = relationship("Medicine", back_populates="purchase_orders")


# ===============================
# STATUS HELPER
# ===============================

def calculate_status(med):
    today = date.today()

    if med.stock_quantity == 0:
        return "out_of_stock"
    if med.expiry_date and med.expiry_date < today:
        return "expired"
    if med.stock_quantity <= med.reorder_level:
        return "low_stock"
    return "active"


# ===============================
# INIT SCRIPT
# ===============================

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")

    db = SessionLocal()

    # Avoid reseeding
    if db.query(Medicine).count() > 0:
        print("✓ Database already seeded")
        db.close()
        return

    medicines = [
        Medicine(
            name="Paracetamol 650mg",
            medicine_code="PCM-650",
            manufacturer="MedSupply Co.",
            generic_name="Acetaminophen",
            category="Analgesic",
            stock_quantity=500,
            reorder_level=50,
            price_per_unit=15,
            cost_price=12,
            mrp=25,
            batch_number="PCM-2024-0892",
            expiry_date=date(2026, 8, 20),
            supplier_name="MedSupply Co.",
            description="Pain reliever",
        ),
        Medicine(
            name="Omeprazole 20mg Capsule",
            medicine_code="OMP-20",
            manufacturer="HealthCare Ltd.",
            generic_name="Omeprazole",
            category="Gastric",
            stock_quantity=45,
            reorder_level=50,
            price_per_unit=65,
            cost_price=50,
            mrp=95,
            batch_number="OMP-2024-5873",
            expiry_date=date(2025, 11, 10),
            supplier_name="HealthCare Ltd.",
        ),
        Medicine(
            name="Aspirin 75mg",
            medicine_code="ASP-75",
            manufacturer="GreenMed",
            generic_name="Aspirin",
            category="Anticoagulant",
            stock_quantity=300,
            reorder_level=40,
            price_per_unit=28,
            cost_price=20,
            mrp=45,
            batch_number="ASP-2023-3401",
            expiry_date=date(2024, 9, 30),
            supplier_name="GreenMed",
        ),
        Medicine(
            name="Atorvastatin 10mg",
            medicine_code="AME-10",
            manufacturer="PharmaCorp",
            generic_name="Atorvastatin Besylate",
            category="Cardiovascular",
            stock_quantity=0,
            reorder_level=30,
            price_per_unit=145,
            cost_price=120,
            mrp=195,
            batch_number="AME-2024-0945",
            expiry_date=date(2025, 10, 15),
            supplier_name="PharmaCorp",
        ),
    ]

    # Calculate status
    for med in medicines:
        med.status = calculate_status(med)

    db.add_all(medicines)
    db.commit()
    print(f"✓ Added {len(medicines)} medicines")

    # ================= SALES =================
    for i in range(10):
        med = random.choice(medicines)
        qty = random.randint(1, 5)
        total = qty * med.price_per_unit

        sale = Sale(
            medicine_id=med.id,
            quantity_sold=qty,
            total_price=total,
            customer_name=f"Customer {i+1}",
            sale_date=datetime.utcnow() - timedelta(hours=random.randint(0, 24)),
            invoice_number=f"INV-2024-{1230+i}",
            payment_method=random.choice(["Cash", "Card", "UPI"]),
            status="completed",
        )
        db.add(sale)

    db.commit()
    print("✓ Added sample sales")

    # ================= PURCHASE ORDERS =================
    purchase_orders = [
        PurchaseOrder(
            medicine_id=medicines[1].id,
            quantity_ordered=100,
            quantity_received=0,
            supplier_name="HealthCare Ltd.",
            order_date=datetime.utcnow() - timedelta(days=2),
            expected_delivery=datetime.utcnow() + timedelta(days=3),
            status="pending",
            total_cost=5000,
        ),
        PurchaseOrder(
            medicine_id=medicines[3].id,
            quantity_ordered=150,
            quantity_received=75,
            supplier_name="PharmaCorp",
            order_date=datetime.utcnow() - timedelta(days=5),
            expected_delivery=datetime.utcnow() - timedelta(days=1),
            actual_delivery=datetime.utcnow() - timedelta(days=1),
            status="partial",
            total_cost=18000,
        ),
    ]

    db.add_all(purchase_orders)
    db.commit()

    print("✓ Added purchase orders")
    db.close()

    print("\n🎉 Database initialization complete!")


if __name__ == "__main__":
    init_db()

# """
# Database initialization script - Run this once to create tables and seed sample data.
# Usage: python backend/init_db.py
# """

# from database import engine, Base, SessionLocal
# from models import Medicine, Sale, PurchaseOrder
# from datetime import datetime, timedelta
# import random

# def init_db():
#     # Create all tables
    # Base.metadata.create_all(bind=engine)
    # print("✓ Database tables created successfully")
    
    # db = SessionLocal()
    
#     # Check if data already exists
#     if db.query(Medicine).count() > 0:
#         print("✓ Database already has data. Skipping seed data.")
#         db.close()
#         return
    
#     # Sample medicines
#     medicines = [
#         Medicine(
#             name="Aspirin 500mg",
#             medicine_code="ASP-500",
#             manufacturer="Generic Pharma",
#             stock_quantity=150,
#             reorder_level=20,
#             price_per_unit=5.0,
#             batch_number="BATCH-001",
#             description="Pain reliever and fever reducer"
#         ),
#         Medicine(
#             name="Amoxicillin 250mg",
#             medicine_code="AMX-250",
#             manufacturer="Antibiotic Inc",
#             stock_quantity=80,
#             reorder_level=30,
#             price_per_unit=8.5,
#             batch_number="BATCH-002",
#             description="Antibiotic for bacterial infections"
#         ),
#         Medicine(
#             name="Metformin 500mg",
#             medicine_code="MET-500",
#             manufacturer="Diabetes Care",
#             stock_quantity=5,
#             reorder_level=25,
#             price_per_unit=3.2,
#             batch_number="BATCH-003",
#             description="Diabetes management medication"
#         ),
#         Medicine(
#             name="Lisinopril 10mg",
#             medicine_code="LIS-10",
#             manufacturer="Cardio Labs",
#             stock_quantity=120,
#             reorder_level=15,
#             price_per_unit=6.5,
#             batch_number="BATCH-004",
#             description="Blood pressure control medication"
#         ),
#         Medicine(
#             name="Omeprazole 20mg",
#             medicine_code="OMP-20",
#             manufacturer="Gastro Solutions",
#             stock_quantity=9,
#             reorder_level=20,
#             price_per_unit=4.0,
#             batch_number="BATCH-005",
#             description="Acid reflux treatment"
#         ),
#         Medicine(
#             name="Vitamin D3 1000IU",
#             medicine_code="VIT-D3",
#             manufacturer="Vitamin Labs",
#             stock_quantity=250,
#             reorder_level=50,
#             price_per_unit=2.5,
#             batch_number="BATCH-006",
#             description="Vitamin D supplement"
#         ),
#     ]
    
#     db.add_all(medicines)
#     db.commit()
#     print(f"✓ Added {len(medicines)} sample medicines")
    
#     # Sample sales
#     for _ in range(15):
#         medicine = random.choice(medicines)
#         quantity = random.randint(1, 10)
#         total_price = quantity * medicine.price_per_unit
        
#         sale = Sale(
#             medicine_id=medicine.id,
#             quantity_sold=quantity,
#             total_price=total_price,
#             customer_name=f"Customer {random.randint(1, 100)}",
#             sale_date=datetime.utcnow() - timedelta(hours=random.randint(0, 24))
#         )
#         db.add(sale)
#         medicine.stock_quantity -= quantity
    
#     db.commit()
#     print("✓ Added 15 sample sales transactions")
    
#     # Sample purchase orders
#     purchase_orders = [
#         PurchaseOrder(
#             medicine_id=medicines[2].id,  # Metformin (low stock)
#             quantity_ordered=100,
#             supplier_name="Pharmaceutical Distributor A",
#             order_date=datetime.utcnow() - timedelta(days=2),
#             expected_delivery=datetime.utcnow() + timedelta(days=3),
#             status="pending",
#             total_cost=320.0
#         ),
#         PurchaseOrder(
#             medicine_id=medicines[4].id,  # Omeprazole (low stock)
#             quantity_ordered=50,
#             supplier_name="Pharmaceutical Distributor B",
#             order_date=datetime.utcnow() - timedelta(days=1),
#             expected_delivery=datetime.utcnow() + timedelta(days=5),
#             status="pending",
#             total_cost=200.0
#         ),
#         PurchaseOrder(
#             medicine_id=medicines[0].id,
#             quantity_ordered=75,
#             quantity_received=50,
#             supplier_name="Pharmaceutical Distributor A",
#             order_date=datetime.utcnow() - timedelta(days=5),
#             actual_delivery=datetime.utcnow() - timedelta(days=2),
#             status="partial",
#             total_cost=375.0
#         ),
#     ]
    
#     db.add_all(purchase_orders)
#     db.commit()
#     print(f"✓ Added {len(purchase_orders)} sample purchase orders")
    
#     db.close()
#     print("\n✓ Database initialization complete!")
#     print("✓ You can now run the FastAPI server with: python -m uvicorn backend.main:app --reload")

# if __name__ == "__main__":
#     init_db()
