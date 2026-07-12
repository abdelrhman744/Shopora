# NEXUS.io — Premium Dark E-commerce

A full-stack e-commerce site implemented from the Figma "premium dark e-commerce UI" design,
with a Next.js/TypeScript/Tailwind storefront and a FastAPI/SQLAlchemy backend.

```
nexus-ecommerce/
├── backend/     FastAPI + SQLAlchemy + SQLite, JWT auth, REST API
└── frontend/    Next.js 15 (App Router) + TypeScript + Tailwind CSS
```

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seed.py                  # creates the 2 admin accounts + sample products
uvicorn app.main:app --reload --port 8000
```

API runs at `http://localhost:8000` (interactive docs at `/docs`).

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Storefront runs at `http://localhost:3000`.

## What's included

**Customer side:** Home, Products (search/filter/sort), Product Details, Cart, Checkout
(no online payment — orders are saved to the database), Login, Register, order-history Dashboard,
Wishlist.

**Admin panel** (`/admin`, linked from the storefront footer): product CRUD with image upload,
stock/price/description editing, and category management. There is no admin self-registration —
the two admin accounts are created by `backend/seed.py` / directly in the database, exactly as
specified. Sign in at `/admin/login`; regular customer accounts are rejected.

Default seeded admin logins (change these before any real deployment):

- `admin1@nexus.io` / `ChangeMe123!`
- `admin2@nexus.io` / `ChangeMe123!`

See `backend/README.md` for backend details and `frontend/.env.local.example` /
`backend/.env.example` for configuration.
