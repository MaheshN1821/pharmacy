from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MedicineBase(BaseModel):
    name: str
    medicine_code: str
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    stock_quantity: int = 0
    reorder_level: int = 10
    price_per_unit: float
    batch_number: Optional[str] = None
    expiry_date: Optional[datetime] = None            
    generic_name: Optional[str] = None
    category: Optional[str] = None
    cost_price: Optional[float] = None
    mrp: Optional[float] = None
    supplier_name: Optional[str] = None
    status: Optional[str] = None

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    stock_quantity: Optional[int] = None
    reorder_level: Optional[int] = None
    price_per_unit: Optional[float] = None
    batch_number: Optional[str] = None
    generic_name: Optional[str] = None
    category: Optional[str] = None
    cost_price: Optional[float] = None
    mrp: Optional[float] = None
    expiry_date: Optional[datetime] = None            
    supplier_name: Optional[str] = None
    status: Optional[str] = None

class Medicine(MedicineBase):
    id: int
    expiry_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SaleBase(BaseModel):
    medicine_id: int
    quantity_sold: int
    customer_name: Optional[str] = None
    notes: Optional[str] = None
    invoice_number: Optional[str] = None
    payment_method: Optional[str] = None
    status: Optional[str] = None

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    total_price: float
    sale_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class PurchaseOrderBase(BaseModel):
    medicine_id: int
    quantity_ordered: int
    supplier_name: Optional[str] = None
    total_cost: Optional[float] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrderUpdate(BaseModel):
    quantity_received: Optional[int] = None
    status: Optional[str] = None
    actual_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class PurchaseOrder(PurchaseOrderBase):
    id: int
    quantity_received: int
    order_date: datetime
    expected_delivery: Optional[datetime] = None
    actual_delivery: Optional[datetime] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_sales_today: float
    items_sold_today: int
    low_stock_items: int
    total_purchase_orders: int
    pending_purchase_orders: int
    purchase_order_value: float  
