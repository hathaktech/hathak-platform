@echo off
echo 🔍 Monitoring Node.js Memory Usage...
echo.

:loop
echo ========================================
echo Time: %time%
echo ========================================

echo 📊 Node.js Processes and Memory:
for /f "tokens=2,5" %%a in ('tasklist /fi "imagename eq node.exe" /fo csv ^| findstr /v "Image Name"') do (
    echo Process ID: %%a, Memory: %%b
)

echo.
echo 🖥️ Total System Memory:
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /format:table

echo.
echo 🔧 Node.js Memory Settings:
echo NODE_OPTIONS=%NODE_OPTIONS%

echo.
echo ⏳ Waiting 30 seconds...
timeout /t 30 /nobreak > nul
cls
goto loop
