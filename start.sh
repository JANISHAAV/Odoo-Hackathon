#!/bin/bash

echo "Starting EcoFinds..."
echo

echo "Starting backend server..."
cd server && npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting frontend server..."
cd ../client && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
