#!/bin/bash

echo "🚌 Starting AUB Bus Transportation System..."
echo "=========================================="

# Kill any existing processes on ports 3000 and 5173
pkill -f "node.*3000" 2>/dev/null || true
pkill -f "vite.*5173" 2>/dev/null || true

# Start backend
echo "🔧 Starting backend server..."
cd backend
node src/index.mjs &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers are running:"
echo "   🔗 Backend API: http://localhost:3000 (PID: $BACKEND_PID)"
echo "   🌐 Frontend UI: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "🎯 Demo Accounts:"
echo "   👑 Admin: admin@bus.com / admin123"
echo "   👤 User:  user@bus.com / user123"
echo ""
echo "🎨 UI Features:"
echo "   • AUB Maroon & Gold theme"
echo "   • Light mode design"
echo "   • Responsive layout"
echo "   • Modern card-based interface"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
