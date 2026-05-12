#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_VENV="$BACKEND_DIR/.venv"
BACKEND_DB_URL="sqlite:///./dev.db"
BACKEND_API_URL="http://127.0.0.1:8000"
FRONTEND_API_URL="http://127.0.0.1:8000"
BACKEND_PID=""

cleanup() {
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
    wait "${BACKEND_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if [[ ! -d "$BACKEND_VENV" ]]; then
  echo "Missing backend virtual environment at $BACKEND_VENV"
  echo "Run: cd backend && python -m venv .venv && source .venv/bin/activate && python -m pip install -r requirements.txt"
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Missing frontend dependencies."
  echo "Run: cd frontend && npm install"
  exit 1
fi

echo "Ensuring local database tables exist..."
(
  cd "$BACKEND_DIR"
  DATABASE_URL="$BACKEND_DB_URL" ./.venv/bin/python -m scripts.create_tables >/dev/null
)

echo "Starting backend on $BACKEND_API_URL ..."
(
  cd "$BACKEND_DIR"
  DATABASE_URL="$BACKEND_DB_URL" ./.venv/bin/python -m uvicorn app.main:app --reload
) &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:3000 ..."
cd "$FRONTEND_DIR"
NEXT_PUBLIC_API_BASE_URL="$FRONTEND_API_URL" npm run dev
