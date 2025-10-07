@echo off
echo 🔍 Monitoring Hathak Platform Memory Usage...
echo.

:loop
echo ============================================
echo 📅 %date% %time%
echo ============================================

echo 🔧 Node.js Processes:
tasklist /fi "imagename eq node.exe" /fo table

echo.
echo 📊 Memory Usage Summary:
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /fo csv ^| find "node.exe"') do (
    echo Node.js Process: %%i KB
)

echo.
echo 💾 System Memory:
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /format:table

echo.
echo ⏳ Refreshing in 30 seconds... (Press Ctrl+C to stop)
timeout /t 30 /nobreak > nul
cls
goto loop
