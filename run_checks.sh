#!/bin/bash
set -e

echo "=== Running backend checks ==="
cd backend

if [ ! -d "node_modules" ]; then
  echo "[install] Installing dependencies..."
  npm install
else
  echo "[install] node_modules found, skipping install."
fi

echo "[lint] Running ESLint..."
npm run lint

echo "[health] Running health check..."
npm run health

echo "All checks passed!"
