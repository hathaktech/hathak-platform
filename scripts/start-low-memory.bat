@echo off
echo 🚀 Starting Hathak Platform with Low Memory Settings...
echo.

REM Set aggressive memory limits
set NODE_OPTIONS=--max-old-space-size=1024 --max-semi-space-size=64 --gc-interval=100
set NODE_ENV=development

echo 📊 Memory Settings:
echo NODE_OPTIONS=%NODE_OPTIONS%
echo NODE_ENV=%NODE_ENV%
echo.

echo 🔧 Starting Backend with low memory...
start "Backend" cmd /k "cd backend && npm run dev:low-memory"

echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo 🔧 Starting Frontend with low memory...
start "Frontend" cmd /k "cd frontend && npm run dev:low-memory"

echo.
echo ✅ Both servers started with low memory settings!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 💡 To stop servers, close the terminal windows
pause
