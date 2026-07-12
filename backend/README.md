# NEXUS.io Backend (FastAPI)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Seed the database (creates the 2 admin accounts + sample products)

```bash
python seed.py
```

Default admin logins (change the passwords in `seed.py` before running in production):

- `admin1@nexus.io` / `ChangeMe123!`
- `admin2@nexus.io` / `ChangeMe123!`

## Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`.

## Notes

- SQLite is used by default (`nexus.db`). Set `DATABASE_URL` in `.env` to a
  PostgreSQL connection string to switch databases.
- Admins are never created through the API — only via `seed.py` / directly in
  the database, per the project requirements. A user becomes an admin when
  `is_admin=True` is set on their row; the same `/api/auth/login` endpoint is
  used for both customers and admins, and the frontend routes them based on
  the `is_admin` flag in the response.
- Uploaded product images are stored in `app/static/uploads` and served at
  `/static/uploads/<filename>`.
