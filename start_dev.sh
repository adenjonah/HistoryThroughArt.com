#!/bin/bash

# Start backend server
cd backend
node index.js &
BACKEND_PID=$!

# Start frontend server
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID
