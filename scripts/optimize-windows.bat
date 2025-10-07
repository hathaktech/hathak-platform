@echo off
echo 🚀 Optimizing Windows for Development...

REM Increase file watcher limits
echo fs.inotify.max_user_watches=524288 | Out-File -FilePath C:\temp\99-watchers.conf -Encoding ASCII
echo fs.inotify.max_user_instances=8192 | Out-File -FilePath C:\temp\99-watchers.conf -Encoding ASCII -Append

REM Set Node.js memory limits
setx NODE_OPTIONS "--max-old-space-size=2048"

REM Optimize Windows Defender exclusions
echo Adding development folders to Windows Defender exclusions...
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\Documents\hathak-platform'"
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Local\npm'"
powershell -Command "Add-MpPreference -ExclusionPath 'C:\Users\%USERNAME%\AppData\Roaming\npm'"

REM Optimize Windows performance
echo Optimizing Windows performance settings...
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100
powercfg -setactive SCHEME_CURRENT

echo ✅ Windows optimization complete!
echo Please restart your terminal and development servers.
pause



