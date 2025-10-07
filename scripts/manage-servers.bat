@echo off
echo ========================================
echo    HATHAK PLATFORM SERVER MANAGER
echo ========================================

:menu
echo.
echo Choose an option:
echo 1. Check server status
echo 2. Start both servers (clean)
echo 3. Stop all servers
echo 4. Restart servers
echo 5. Kill all Node.js processes
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto killall
if "%choice%"=="6" goto exit
goto menu

:status
echo.
echo === SERVER STATUS ===
echo Checking ports 3000 and 5000...
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel%==0 (
    echo Frontend (Next.js): RUNNING on port 3000
) else (
    echo Frontend (Next.js): NOT RUNNING
)

netstat -ano | findstr ":5000" | findstr "LISTENING"
if %errorlevel%==0 (
    echo Backend (Express): RUNNING on port 5000
) else (
    echo Backend (Express): NOT RUNNING
)

echo.
tasklist | findstr node | find /c "node.exe" > temp_count.txt
set /p node_count=<temp_count.txt
del temp_count.txt
echo Total Node.js processes: %node_count%
goto menu

:start
echo.
echo === STARTING SERVERS ===
echo Stopping any existing servers first...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Backend (Express) on port 5000...
start "Backend Server" cmd /k "cd backend && npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend (Next.js) on port 3000...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Servers started! Check the new terminal windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
goto menu

:stop
echo.
echo === STOPPING SERVERS ===
echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
echo All servers stopped.
goto menu

:restart
echo.
echo === RESTARTING SERVERS ===
call :stop
timeout /t 2 /nobreak >nul
call :start
goto menu

:killall
echo.
echo === KILLING ALL NODE.JS PROCESSES ===
echo WARNING: This will stop ALL Node.js applications!
set /p confirm="Are you sure? (y/N): "
if /i "%confirm%"=="y" (
    taskkill /f /im node.exe 2>nul
    echo All Node.js processes killed.
) else (
    echo Operation cancelled.
)
goto menu

:exit
echo.
echo Goodbye!
pause
exit
