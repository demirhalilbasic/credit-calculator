#!/bin/bash
# Start script for the Credit Calculator application

echo "Starting Credit Calculator..."

# Start backend
echo "Starting FastAPI backend..."
cd backend
python -m venv venv 2>/dev/null || true
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting React frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo "Application started successfully!"
echo "Backend running on: http://localhost:8000"
echo "Frontend running on: http://localhost:3000"
echo "API docs: http://localhost:8000/docs"
echo "=========================================="
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
