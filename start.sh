#!/bin/bash

echo "🚌 Starting AUB Bus Transportation System..."

# Kill existing processes
pkill -f "node.*server" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend
echo "🔧 Starting backend on port 3000..."
cd backend
node server.cjs &

# Wait for backend
sleep 3

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:3000/trips > /dev/null && echo "✅ Backend is running!" || echo "❌ Backend failed to start"

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
npm run dev &

echo ""
echo "🎯 Login credentials:"
echo "   👤 User: user@bus.com / user123"
echo "   👑 Admin: admin@bus.com / admin123"
echo ""
echo "🆕 New Features:"
echo "   💳 Quota recharge with AUB ID"
echo "   🗺️ Multi-stop trip planner"
echo ""
echo "Press Ctrl+C to stop all servers"

wait
