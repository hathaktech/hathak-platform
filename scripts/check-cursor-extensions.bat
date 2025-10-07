@echo off
echo 🔍 Checking Cursor Extensions and Performance...
echo.

echo 📊 Current Cursor Processes:
tasklist /fi "imagename eq Cursor.exe" /fo table

echo.
echo 💾 Memory Usage by Cursor:
wmic process where "name='Cursor.exe'" get ProcessId,PageFileUsage,WorkingSetSize /format:table

echo.
echo 🔧 Extension Recommendations:
echo.
echo ❌ DISABLE THESE EXTENSIONS (if installed):
echo - Any theme extensions (except one you actively use)
echo - GitLens (heavy Git extension)
echo - Bracket Pair Colorizer (built into Cursor now)
echo - Auto Rename Tag
echo - Color Highlight
echo - Indent Rainbow
echo - Rainbow Brackets
echo - Any language servers for languages you don't use
echo - Multiple TypeScript/JavaScript extensions
echo - Multiple CSS/HTML extensions
echo - Any AI extensions beyond Cursor's built-in AI
echo - Live Server (if you're using Next.js dev server)
echo - Prettier (if you have ESLint configured)
echo - Multiple formatter extensions
echo.
echo ✅ KEEP THESE ESSENTIAL EXTENSIONS:
echo - ESLint (if configured)
echo - One theme extension (if you use custom themes)
echo - One Git extension (if you need advanced Git features)
echo - Language-specific extensions for your main languages
echo.
echo 📋 To check your extensions:
echo 1. Open Cursor
echo 2. Press Ctrl+Shift+X
echo 3. Look at the "Installed" tab
echo 4. Disable extensions you don't actively use
echo.
echo 💡 Pro tip: Disable extensions one by one and restart Cursor
echo    to see which ones are causing the most performance impact.
echo.
pause

