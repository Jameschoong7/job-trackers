# Job Tracker

A personal full-stack job application tracker built as a portfolio project and practical tool.

Phase 1 focuses on core CRUD for job applications using demo/local data only. Authentication, AI resume tooling, job scraping, reminders, and dashboards are intentionally out of scope for now.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Python, SQLAlchemy
- Database: PostgreSQL for deployment, local SQLite for development convenience
- Planned hosting: Vercel frontend, Railway backend, Neon PostgreSQL

## Project Structure

```txt
frontend/   Next.js app
backend/    FastAPI app
```

## Local Development

Run the backend and frontend in separate terminals.

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Create local development tables:

```bash
DATABASE_URL="sqlite:///./dev.db" python -m scripts.create_tables
```

Start the backend:

```bash
DATABASE_URL="sqlite:///./dev.db" python -m uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

Health check:

```bash
curl -s http://127.0.0.1:8000/health
```

Expected:

```json
{"status":"ok"}
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

By default, the frontend calls:

```txt
http://127.0.0.1:8000
```

Override with:

```bash
NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8000" npm run dev
```

## Verification

Run backend tests:

```bash
cd backend
source .venv/bin/activate
DATABASE_URL="postgresql+psycopg://username:password@host/database" python -m pytest tests/test_crud.py tests/test_applications_routes.py -q
```

Run frontend lint:

```bash
cd frontend
npm run lint
```

Run frontend production build:

```bash
cd frontend
npm run build
```

## Current Features

- List applications
- Filter applications by status
- View application detail
- Create application
- Edit application
- Delete application
- Summary counts by status

## API

Base resource:

```txt
/applications
```

Endpoints:

```txt
GET    /applications
GET    /applications?status=Applied
GET    /applications/{id}
POST   /applications
PUT    /applications/{id}
DELETE /applications/{id}
```

## Data Model

Main table:

```txt
job_applications
```

Fields:

- `id`
- `company`
- `role`
- `url`
- `status`
- `date_applied`
- `followup_date`
- `followup_note`
- `notes`
- `created_at`
- `updated_at`

## Privacy

Do not put real private job-search data into a public demo deployment.

Until authentication or other protection is added, use demo/fake data only.
