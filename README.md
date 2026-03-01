# Pharmacy EMR API — Documentation

A RESTful backend API for a Pharmacy Electronic Medical Records (EMR) system, built with **FastAPI**, **SQLAlchemy**, and **PostgreSQL (Neon)**. It manages medicine inventory, sales transactions, and purchase orders, and exposes a dashboard for real-time pharmacy analytics.
Live Link: https://pharmacy-emr-umber.vercel.app/
---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [REST API Structure](#rest-api-structure)
- [API Contracts](#api-contracts)
  - [Dashboard Endpoints](#dashboard-endpoints)
  - [Inventory Endpoints](#inventory-endpoints)
  - [Sales Endpoints](#sales-endpoints)
  - [Purchase Order Endpoints](#purchase-order-endpoints)
  - [Health Check](#health-check)
- [Data Consistency Mechanisms](#data-consistency-mechanisms)
- [Status Logic](#status-logic)
- [Running Locally](#running-locally)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL via Neon |
| Validation | Pydantic v2 |
| Server | Uvicorn |
| Deployment | Vercel |

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── database.py      # DB engine, session, Base
│   ├── models.py        # SQLAlchemy ORM models + status logic
│   ├── schemas.py       # Pydantic request/response schemas
│   └── main.py          # FastAPI routes and business logic
├── init_db.py           # DB initialization / seeding script
├── requirements.txt
└── verce.json           # Vercel deployment config
```

---

## Database Models

### Medicine

Represents a drug/product in the pharmacy inventory.

| Column | Type | Description |
|---|---|---|
| `id` | Integer (PK) | Auto-generated primary key |
| `name` | String | Medicine name |
| `medicine_code` | String (unique) | Unique identifier code |
| `description` | Text | Optional description |
| `manufacturer` | String | Manufacturer name |
| `generic_name` | String | Generic drug name |
| `category` | String | Drug category |
| `stock_quantity` | Integer | Current quantity in stock |
| `reorder_level` | Integer | Threshold triggering low-stock alert |
| `price_per_unit` | Float | Selling price per unit |
| `cost_price` | Float | Purchase cost per unit |
| `mrp` | Float | Maximum retail price |
| `batch_number` | String | Batch identifier |
| `expiry_date` | DateTime | Expiry date of the batch |
| `supplier_name` | String | Associated supplier |
| `status` | String | `active`, `low_stock`, `out_of_stock`, `expired` |
| `created_at` | DateTime | Record creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

---

### Sale

Records each sales transaction against a medicine.

| Column | Type | Description |
|---|---|---|
| `id` | Integer (PK) | Auto-generated primary key |
| `medicine_id` | Integer (FK) | References `medicines.id` |
| `quantity_sold` | Integer | Units sold |
| `total_price` | Float | Auto-calculated: `price_per_unit × quantity_sold` |
| `customer_name` | String | Optional customer name |
| `invoice_number` | String (unique) | Unique invoice reference |
| `payment_method` | String | `cash`, `card`, or `UPI` |
| `status` | String | `completed` by default |
| `sale_date` | DateTime | Timestamp of the sale |
| `notes` | Text | Optional notes |

---

### PurchaseOrder

Tracks orders placed with suppliers to replenish stock.

| Column | Type | Description |
|---|---|---|
| `id` | Integer (PK) | Auto-generated primary key |
| `medicine_id` | Integer (FK) | References `medicines.id` |
| `quantity_ordered` | Integer | Units ordered |
| `quantity_received` | Integer | Units actually received so far |
| `supplier_name` | String | Supplier name |
| `order_date` | DateTime | When the order was placed |
| `expected_delivery` | DateTime | Expected delivery date |
| `actual_delivery` | DateTime | Actual delivery date |
| `status` | String | `pending`, `partial`, `completed`, `cancelled` |
| `total_cost` | Float | Total cost of the order |
| `notes` | Text | Optional notes |
| `created_at` / `updated_at` | DateTime | Timestamps |

---

## REST API Structure

The API is organized into four functional groups, all prefixed under `/api/`:

```
/api/
├── dashboard/
│   ├── summary          → Aggregated KPIs
│   ├── low-stock        → Medicines below reorder level
│   ├── recent-sales     → Latest transactions
│   └── pending-orders   → Undelivered purchase orders
│
├── inventory/
│   ├── GET    /         → List all medicines (search + pagination)
│   ├── GET    /:id      → Get a single medicine
│   ├── POST   /         → Create a new medicine
│   ├── PUT    /:id      → Update a medicine
│   └── DELETE /:id      → Delete a medicine
│
├── sales/
│   └── POST   /         → Record a new sale (auto-deducts stock)
│
└── purchase-orders/
    ├── POST   /         → Create a new purchase order
    └── PUT    /:id      → Update order (auto-adds stock on receipt)
```

Each route uses FastAPI's dependency injection (`Depends(get_db)`) to get a database session. Every session is scoped to a single request — opened before the handler and closed after, ensuring no session leaks.

---

## API Contracts

### Dashboard Endpoints

#### `GET /api/dashboard/summary`

Returns aggregated KPIs for today's activity and overall inventory health.

**Response `200 OK`:**
```json
{
  "total_sales_today": 1250.00,
  "items_sold_today": 34,
  "low_stock_items": 5,
  "total_purchase_orders": 12,
  "pending_purchase_orders": 3,
  "purchase_order_value": 45000.00
}
```

---

#### `GET /api/dashboard/low-stock`

Returns medicines where `stock_quantity <= reorder_level`, ordered by urgency (largest deficit first).

**Response `200 OK`:** Array of `Medicine` objects (see Medicine schema below).

---

#### `GET /api/dashboard/recent-sales?limit=10`

Returns the most recent sales transactions.

| Query Param | Type | Default | Description |
|---|---|---|---|
| `limit` | int | 10 | Number of results (1–100) |

**Response `200 OK`:** Array of `Sale` objects.

---

#### `GET /api/dashboard/pending-orders`

Returns all purchase orders with status `pending` or `partial`.

**Response `200 OK`:** Array of `PurchaseOrder` objects.

---

### Inventory Endpoints

#### `GET /api/inventory`

List all medicines with optional search and pagination.

| Query Param | Type | Default | Description |
|---|---|---|---|
| `skip` | int | 0 | Number of records to skip |
| `limit` | int | 50 | Records per page (1–100) |
| `search` | string | `""` | Case-insensitive search on name or medicine code |

**Response `200 OK`:** Array of `Medicine` objects.

---

#### `GET /api/inventory/{medicine_id}`

Fetch a single medicine by its ID. Status is recalculated on every read.

**Response `200 OK`:**
```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "medicine_code": "MED-001",
  "description": "Antipyretic and analgesic",
  "manufacturer": "ABC Pharma",
  "generic_name": "Paracetamol",
  "category": "Analgesic",
  "stock_quantity": 150,
  "reorder_level": 50,
  "price_per_unit": 2.50,
  "cost_price": 1.20,
  "mrp": 3.00,
  "batch_number": "B2024-01",
  "expiry_date": "2026-12-31T00:00:00",
  "supplier_name": "MediSupply Co.",
  "status": "active",
  "created_at": "2026-01-01T10:00:00",
  "updated_at": "2026-03-01T09:30:00"
}
```

**Error `404 Not Found`:**
```json
{ "detail": "Medicine not found" }
```

---

#### `POST /api/inventory`

Create a new medicine. The `medicine_code` must be unique.

**Request Body:**
```json
{
  "name": "Amoxicillin 250mg",
  "medicine_code": "MED-045",
  "price_per_unit": 5.00,
  "stock_quantity": 200,
  "reorder_level": 30,
  "manufacturer": "XYZ Labs",
  "generic_name": "Amoxicillin",
  "category": "Antibiotic",
  "cost_price": 3.50,
  "mrp": 6.50,
  "expiry_date": "2027-06-30T00:00:00",
  "batch_number": "B2025-12",
  "supplier_name": "PharmaNet"
}
```

**Response `201 Created`:** The created `Medicine` object.

**Error `400 Bad Request`:**
```json
{ "detail": "Medicine code already exists" }
```

---

#### `PUT /api/inventory/{medicine_id}`

Partially update a medicine. Only fields included in the request body are updated (`exclude_unset=True`). The `status` field is automatically recalculated after every update.

**Request Body (all fields optional):**
```json
{
  "stock_quantity": 300,
  "price_per_unit": 2.75,
  "reorder_level": 40
}
```

**Response `200 OK`:** The updated `Medicine` object.

**Error `404 Not Found`:**
```json
{ "detail": "Medicine not found" }
```

---

#### `DELETE /api/inventory/{medicine_id}`

Delete a medicine record permanently.

**Response `204 No Content`**

**Error `404 Not Found`:**
```json
{ "detail": "Medicine not found" }
```

---

### Sales Endpoints

#### `POST /api/sales`

Record a new sale. This endpoint validates stock availability, auto-calculates the total price, deducts stock, and recalculates the medicine's status — all in a single atomic transaction.

**Request Body:**
```json
{
  "medicine_id": 1,
  "quantity_sold": 10,
  "customer_name": "Rahul Sharma",
  "invoice_number": "INV-20260301-001",
  "payment_method": "UPI",
  "notes": "Regular prescription refill"
}
```

**Response `201 Created`:**
```json
{
  "id": 42,
  "medicine_id": 1,
  "quantity_sold": 10,
  "total_price": 25.00,
  "customer_name": "Rahul Sharma",
  "invoice_number": "INV-20260301-001",
  "payment_method": "UPI",
  "status": "completed",
  "sale_date": "2026-03-01T11:45:00",
  "created_at": "2026-03-01T11:45:00",
  "notes": "Regular prescription refill"
}
```

**Error `404 Not Found`:**
```json
{ "detail": "Medicine not found" }
```

**Error `400 Bad Request`:**
```json
{ "detail": "Insufficient stock" }
```

---

### Purchase Order Endpoints

#### `POST /api/purchase-orders`

Create a new purchase order for a medicine. Validates that the medicine exists before creating the order.

**Request Body:**
```json
{
  "medicine_id": 1,
  "quantity_ordered": 500,
  "supplier_name": "MediSupply Co.",
  "total_cost": 600.00,
  "notes": "Urgent restock"
}
```

**Response `201 Created`:** The created `PurchaseOrder` object.

---

#### `PUT /api/purchase-orders/{order_id}`

Update a purchase order — typically used to record received stock. When `quantity_received` is provided, the system automatically calculates the difference between the new and previous value and updates the medicine's `stock_quantity` accordingly. The medicine's status is recalculated after the stock adjustment.

**Request Body (all fields optional):**
```json
{
  "quantity_received": 300,
  "status": "partial",
  "actual_delivery": "2026-03-01T14:00:00",
  "notes": "Partial delivery received"
}
```

**Response `200 OK`:** The updated `PurchaseOrder` object.

**Error `404 Not Found`:**
```json
{ "detail": "Purchase order not found" }
```

---

### Health Check

#### `GET /api/health`

Confirms the API is running.

**Response `200 OK`:**
```json
{ "status": "ok", "message": "Pharmacy EMR API is running" }
```

---

## Data Consistency Mechanisms

The API enforces data consistency at multiple levels to ensure the inventory, sales, and purchase records remain accurate and synchronized at all times.

### 1. Atomic Database Transactions

Every write operation — whether a sale, an inventory update, or a purchase order receipt — uses a single SQLAlchemy session and commits only after all related changes succeed. If any step raises an exception, the entire transaction is rolled back automatically. For example, when recording a sale, the `Sale` record insertion and the `Medicine.stock_quantity` decrement happen together in one `db.commit()` call. Neither persists without the other.

### 2. Stock Validation Before Sale

Before any sale is recorded, the `create_sale` function checks that the requested `quantity_sold` does not exceed `medicine.stock_quantity`. If stock is insufficient, a `400 Bad Request` is returned immediately and no database change is made. This prevents the inventory from going into negative values.

```python
if medicine.stock_quantity < sale.quantity_sold:
    raise HTTPException(status_code=400, detail="Insufficient stock")
```

### 3. Auto-Calculated Fields (No Client Trust)

Fields that could be manipulated by a client are always calculated server-side:

- **`total_price`** in a Sale is always computed as `medicine.price_per_unit × quantity_sold` — the client cannot send or override this value.
- **`status`** in Medicine is never accepted from the client on update; it is always derived from the current state of `stock_quantity`, `reorder_level`, and `expiry_date` using the `determine_medicine_status()` function.

### 4. Incremental Stock Update for Purchase Orders

When a purchase order is updated to record received goods, the system computes the **difference** between the newly provided `quantity_received` and the previously stored value, then applies only that delta to `stock_quantity`. This prevents double-counting stock if the same order is updated multiple times (e.g., two partial deliveries):

```python
difference = update_data["quantity_received"] - purchase_order.quantity_received
medicine.stock_quantity += difference
```

### 5. Partial Updates with `exclude_unset=True`

The `MedicineUpdate` Pydantic schema uses `exclude_unset=True` when converting to a dict, so only fields explicitly included in the request body are applied to the database record. This prevents accidental overwriting of fields with `None` when a client sends a partial update.

### 6. Unique Constraint Enforcement

The `medicine_code` field has a database-level `unique=True` constraint, and the `create_medicine` endpoint proactively checks for duplicates before insertion, returning a clear `400` error rather than relying on a database exception alone.

### 7. Status Recalculation on Every Mutation

The `determine_medicine_status()` function is called after every inventory change — whether from a direct update, a sale deduction, or a purchase order receipt. This keeps the `status` field consistently reflecting reality without any manual intervention:

```python
def determine_medicine_status(med):
    if med.expiry_date and med.expiry_date <= now:  → "expired"
    if med.stock_quantity <= 0:                      → "out_of_stock"
    if med.stock_quantity <= med.reorder_level:      → "low_stock"
    return "active"
```

### 8. Session Lifecycle Management

The `get_db()` dependency uses a `try/finally` block to guarantee the database session is closed after every request, even if an unhandled exception occurs:

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## Status Logic

The `determine_medicine_status()` function evaluates in priority order:

| Priority | Condition | Status |
|---|---|---|
| 1 | `expiry_date` is in the past | `expired` |
| 2 | `stock_quantity <= 0` | `out_of_stock` |
| 3 | `stock_quantity <= reorder_level` | `low_stock` |
| 4 | Otherwise | `active` |

---

## Running Locally

```bash
# 1. Clone the repo and navigate to the backend
cd health/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variable
echo "DATABASE_URL=postgresql://user:password@host/dbname" > .env

# 4. Initialize the database (optional seeding)
python init_db.py

# 5. Start the development server
uvicorn app.main:app --reload --port 8000
```
