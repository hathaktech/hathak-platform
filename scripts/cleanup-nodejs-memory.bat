@echo off
echo 🧹 Cleaning up Node.js memory usage...
echo.

echo 📊 Current Node.js processes:
tasklist /fi "imagename eq node.exe" /fo table

echo.
echo 🔧 Killing unnecessary Node.js processes...
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /fo csv ^| findstr /v "Image Name"') do (
    echo Killing process %%a
    taskkill /pid %%a /f >nul 2>&1
)

echo.
echo 🧹 Clearing Node.js cache...
if exist "frontend\.next" rmdir /s /q "frontend\.next"
if exist "frontend\node_modules\.cache" rmdir /s /q "frontend\node_modules\.cache"
if exist "backend\node_modules\.cache" rmdir /s /q "backend\node_modules\.cache"

echo.
echo 🧹 Clearing npm cache...
npm cache clean --force >nul 2>&1

echo.
echo 🧹 Clearing temporary files...
del /q /f /s "%temp%\*" >nul 2>&1
del /q /f /s "C:\Windows\Temp\*" >nul 2>&1

echo.
echo ✅ Memory cleanup complete!
echo.
echo 📊 Remaining Node.js processes:
tasklist /fi "imagename eq node.exe" /fo table

echo.
echo 💡 You can now restart your development servers with low memory settings.
pause
