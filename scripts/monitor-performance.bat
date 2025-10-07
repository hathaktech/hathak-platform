@echo off
echo 🔍 Monitoring System Performance...
echo.

:loop
echo ========================================
echo Time: %time%
echo ========================================

echo 📊 Memory Usage:
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /format:table

echo.
echo 🖥️ CPU Usage:
wmic cpu get loadpercentage /format:table

echo.
echo 🔧 Node.js Processes:
tasklist /fi "imagename eq node.exe" /fo table

echo.
echo 📁 Cursor Processes:
tasklist /fi "imagename eq Cursor.exe" /fo table

echo.
echo ⏳ Waiting 30 seconds...
timeout /t 30 /nobreak > nul
cls
goto loop


