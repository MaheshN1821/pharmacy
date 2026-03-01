from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    medicine_code = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    manufacturer = Column(String(255))
    stock_quantity = Column(Integer, default=0)
    reorder_level = Column(Integer, default=10)
    price_per_unit = Column(Float, nullable=False)
    expiry_date = Column(DateTime)
    batch_number = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    generic_name = Column(String)
    category = Column(String)
    cost_price = Column(Float)
    mrp = Column(Float)
    supplier_name = Column(String)
    status = Column(String, default="active")

    sales = relationship("Sale", back_populates="medicine")
    purchase_orders = relationship("PurchaseOrder", back_populates="medicine")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    quantity_sold = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    customer_name = Column(String(255))
    sale_date = Column(DateTime, default=datetime.utcnow, index=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

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
    actual_delivery = Column(DateTime)
    status = Column(String(50), default="pending")  # pending, partial, completed, cancelled
    total_cost = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    medicine = relationship("Medicine", back_populates="purchase_orders")

def determine_medicine_status(med: Medicine):
    now = datetime.now(timezone.utc)
    if med.expiry_date and med.expiry_date <= now:
        return "expired"
    if med.stock_quantity <= 0:
        return "out_of_stock"
    if med.stock_quantity <= med.reorder_level:
        return "low_stock"
    return "active"