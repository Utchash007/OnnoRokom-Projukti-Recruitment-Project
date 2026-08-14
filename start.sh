#!/bin/sh
set -e

echo "Starting ASP.NET Core Backend on port 5000..."
cd /app/backend
dotnet OnnoRokomBackend.dll &
BACKEND_PID=$!

echo "Starting Next.js Frontend on port ${PORT:-3000}..."
cd /app/frontend
PORT=${PORT:-3000} node server.js &
FRONTEND_PID=$!

# Wait for any process to exit
wait -n $BACKEND_PID $FRONTEND_PID
exit $?
