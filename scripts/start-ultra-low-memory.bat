@echo off
echo 🚀 Starting Hathak Platform with ULTRA LOW Memory Settings...
echo ⚠️  WARNING: This mode sacrifices performance for memory efficiency
echo.

REM Set extremely aggressive memory limits
set NODE_OPTIONS=--max-old-space-size=256 --max-semi-space-size=16 --gc-interval=25 --optimize-for-size --no-warnings
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1

echo 📊 Ultra Low Memory Settings:
echo NODE_OPTIONS=%NODE_OPTIONS%
echo NODE_ENV=%NODE_ENV%
echo NEXT_TELEMETRY_DISABLED=%NEXT_TELEMETRY_DISABLED%
echo.

echo 🔧 Starting Backend with minimal memory...
start "Backend" cmd /k "cd backend && set NODE_OPTIONS=%NODE_OPTIONS% && npm run dev"

echo ⏳ Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak > nul

echo 🔧 Starting Frontend with minimal memory...
start "Frontend" cmd /k "cd frontend && npm run dev:minimal"

echo.
echo ✅ Both servers started with ULTRA LOW memory settings!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 💡 Performance will be slower but memory usage will be minimal
echo 💡 To stop servers, close the terminal windows
pause
