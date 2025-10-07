@echo off
echo Fixing Next.js Turbopack Runtime Error...
echo.

echo Step 1: Clearing Next.js cache...
if exist "frontend\.next" (
    rmdir /s /q "frontend\.next"
    echo .next directory removed
) else (
    echo .next directory not found
)

if exist "frontend\node_modules\.cache" (
    rmdir /s /q "frontend\node_modules\.cache"
    echo node_modules cache cleared
) else (
    echo node_modules cache not found
)

echo.
echo Step 2: Clearing npm cache...
cd frontend
npm cache clean --force

echo.
echo Step 3: Reinstalling dependencies...
npm install

echo.
echo Step 4: Starting development server with stable mode...
echo You can now run: npm run dev:stable
echo.
echo If you still have issues, try:
echo 1. npm run dev:stable (without Turbopack)
echo 2. Restart your terminal/IDE
echo 3. Check if Node.js version is compatible (recommended: 18.x or 20.x)
echo.
pause
