# Pharmacy EMR Backend

FastAPI backend for the Pharmacy Electronic Medical Records system with Neon PostgreSQL integration.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 2. Configure Database Connection

- Create a Neon project at [https://neon.tech](https://neon.tech)
- Copy your PostgreSQL connection string
- Create a `.env` file in the backend directory:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/database
API_PORT=8000
API_HOST=0.0.0.0
```

### 3. Initialize Database

```bash
python backend/init_db.py
```

This will create all tables and populate with sample data.

### 4. Run the Server

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Dashboard

- `GET /api/dashboard/summary` - Dashboard summary (sales, items, stock info)
- `GET /api/dashboard/low-stock` - Items below reorder level
- `GET /api/dashboard/recent-sales` - Recent sales transactions
- `GET /api/dashboard/pending-orders` - Pending purchase orders

### Inventory Management

- `GET /api/inventory` - List all medicines (with search & pagination)
- `GET /api/inventory/{id}` - Get specific medicine
- `POST /api/inventory` - Create new medicine
- `PUT /api/inventory/{id}` - Update medicine
- `DELETE /api/inventory/{id}` - Delete medicine

### Sales

- `POST /api/sales` - Create new sale transaction

### Purchase Orders

- `POST /api/purchase-orders` - Create new purchase order
- `PUT /api/purchase-orders/{id}` - Update purchase order

### Health

- `GET /api/health` - Health check

## API Documentation

Interactive API documentation available at `http://localhost:8000/docs` (Swagger UI)
