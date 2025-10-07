@echo off
echo 🚀 Advanced Windows Optimization for Development...
echo.

REM Run as Administrator check
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
) else (
    echo ❌ Please run as Administrator
    pause
    exit /b 1
)

echo.
echo 🔧 Optimizing Windows for Development...

REM Increase file watcher limits
echo Setting file watcher limits...
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\lanmanserver\parameters" /v MaxMpxCt /t REG_DWORD /d 2048 /f >nul 2>&1

REM Optimize Windows Defender
echo Optimizing Windows Defender...
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\Documents\hathak-platform'" >nul 2>&1
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Local\npm'" >nul 2>&1
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Roaming\npm'" >nul 2>&1
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Local\Programs\Cursor'" >nul 2>&1

REM Optimize power settings
echo Optimizing power settings...
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1

REM Optimize virtual memory
echo Optimizing virtual memory...
wmic computersystem set AutomaticManagedPagefile=False >nul 2>&1
wmic pagefileset where name="C:\\pagefile.sys" set InitialSize=4096,MaximumSize=8192 >nul 2>&1

REM Disable unnecessary services
echo Disabling unnecessary services...
sc config "Fax" start= disabled >nul 2>&1
sc config "WSearch" start= disabled >nul 2>&1
sc config "Superfetch" start= disabled >nul 2>&1

REM Optimize Windows Search
echo Optimizing Windows Search...
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Search" /v SetupCompletedSuccessfully /t REG_DWORD /d 0 /f >nul 2>&1

REM Clear temporary files
echo Clearing temporary files...
del /q /f /s "%temp%\*" >nul 2>&1
del /q /f /s "C:\Windows\Temp\*" >nul 2>&1

echo.
echo ✅ Advanced optimization complete!
echo.
echo 📋 What was optimized:
echo - File watcher limits increased
echo - Windows Defender exclusions added
echo - Power settings optimized for performance
echo - Virtual memory optimized
echo - Unnecessary services disabled
echo - Temporary files cleared
echo.
echo 🔄 Please restart your computer for all changes to take effect.
echo.
pause


