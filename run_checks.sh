#!/bin/bash

# Exit on first error
set -e

echo "=== Backend Local Check Script ==="

# 1. Move into backend folder
cd backend

# 2. Install dependencies (only if node_modules is missing)
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed, skipping npm install."
fi

# 3. Run lint check
echo "Running ESLint..."
npm run lint || { 
  echo "Lint failed! Fix issues before continuing."; 
  exit 1; 
}

echo "Lint passed! Backend is ready."
