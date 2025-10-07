@echo off
echo 🚀 Optimizing Development Environment for Low Memory Usage...
echo.

REM Disable Windows Search indexing for development folders
echo 📁 Disabling Windows Search indexing...
powershell -Command "Get-WmiObject -Class Win32_Volume | Where-Object {$_.DriveLetter -eq 'C:'} | ForEach-Object {$_.SetIndexingEnabled($false)}" 2>nul

REM Set Windows performance to high performance
echo ⚡ Setting Windows to high performance mode...
powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

REM Optimize Windows Defender exclusions
echo 🛡️ Adding development folders to Windows Defender exclusions...
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\Documents\hathak-platform'" 2>nul
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Local\npm'" 2>nul
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Roaming\npm'" 2>nul
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Local\Temp'" 2>nul

REM Set Node.js global memory limits
echo 🔧 Setting Node.js memory limits...
setx NODE_OPTIONS "--max-old-space-size=512 --optimize-for-size" 2>nul

REM Disable Next.js telemetry
echo 📊 Disabling Next.js telemetry...
setx NEXT_TELEMETRY_DISABLED "1" 2>nul

REM Clear npm cache
echo 🧹 Clearing npm cache...
npm cache clean --force 2>nul

REM Optimize Windows file system
echo 💾 Optimizing Windows file system...
fsutil behavior set DisableLastAccess 1 2>nul
fsutil behavior set Disable8dot3 1 2>nul

echo.
echo ✅ Development environment optimization complete!
echo.
echo 📋 Changes made:
echo   - Disabled Windows Search indexing
echo   - Set high performance power plan
echo   - Added Defender exclusions
echo   - Set Node.js memory limits
echo   - Disabled Next.js telemetry
echo   - Cleared npm cache
echo   - Optimized file system
echo.
echo 🔄 Please restart your terminal and development servers for changes to take effect.
pause
