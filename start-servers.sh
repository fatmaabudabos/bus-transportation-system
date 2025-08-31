#!/bin/bash

echo "🚌 Starting AUB Bus Transportation System..."

# Kill existing processes
pkill -f "node.*index.mjs" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend
echo "🔧 Starting backend..."
cd backend
node src/index.mjs &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ System ready!"
echo "   🔗 Backend: http://localhost:3000"
echo "   🌐 Frontend: http://localhost:5173 (or 5174)"
echo ""
echo "🎯 Login with:"
echo "   👤 User: user@bus.com / user123"
echo "   👑 Admin: admin@bus.com / admin123"
echo ""
echo "Press Ctrl+C to stop"

wait
