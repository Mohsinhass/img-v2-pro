@echo off
cls
color 0A
title 🚀 Img V2 Pro Developer Menu

:menu
echo.
echo ==========================================
echo        🎨 Img V2 Pro Developer Menu
echo ==========================================
echo.
echo Choose an option:
echo.
echo [1] 🚀 Start Full App (Frontend + Backend)
echo [2] 🎨 Start Frontend Only 
echo [3] 🔧 Start Backend Only
echo [4] 📦 Build for Production
echo [5] 🌐 Deploy to Web
echo [6] 🛠️  Install/Update Dependencies
echo [7] ❌ Exit
echo.
echo ==========================================
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto start_full
if "%choice%"=="2" goto start_frontend
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto build_prod
if "%choice%"=="5" goto deploy
if "%choice%"=="6" goto install_deps
if "%choice%"=="7" goto exit
goto menu

:start_full
echo.
echo 🚀 Starting Full Application...
echo This will open both frontend and backend!
echo.
call start-full-app.bat
goto menu

:start_frontend
echo.
echo 🎨 Starting Frontend Only...
echo Opening http://localhost:5173
echo.
npm start
goto menu

:start_backend
echo.
echo 🔧 Starting Backend Only...
echo.
cd heif-convert
if not exist ".venv" (
    echo Setting up Python environment...
    python -m venv .venv
    call .venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call .venv\Scripts\activate
)
echo Opening http://localhost:5001
uvicorn api.main:app --host 0.0.0.0 --port 5001 --reload
cd ..
goto menu

:build_prod
echo.
echo 📦 Building for Production...
echo.
npm run build
echo.
echo ✅ Build complete! Check the 'build' folder.
echo Ready to deploy to Netlify, Vercel, etc.
echo.
pause
goto menu

:deploy
echo.
echo 🌐 Deployment Options:
echo.
echo [1] Build and open Netlify
echo [2] Build and open Vercel
echo [3] Just build (manual deploy)
echo [4] Back to main menu
echo.
set /p deploy_choice="Choose deployment option (1-4): "

if "%deploy_choice%"=="1" (
    npm run build
    start https://app.netlify.com/drop
    echo Drag your 'build' folder to Netlify!
)
if "%deploy_choice%"=="2" (
    npm run build
    echo Install Vercel CLI: npm install -g vercel
    echo Then run: vercel --prod
)
if "%deploy_choice%"=="3" (
    npm run build
    echo Build complete! Upload 'build' folder to your hosting provider.
)
if "%deploy_choice%"=="4" goto menu

pause
goto menu

:install_deps
echo.
echo 🛠️  Installing/Updating Dependencies...
echo.
echo Installing frontend dependencies...
npm install

echo.
echo Setting up backend environment...
cd heif-convert
if not exist ".venv" (
    python -m venv .venv
)
call .venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo ✅ All dependencies updated!
pause
goto menu

:exit
echo.
echo 👋 Thanks for using Img V2 Pro Developer Menu!
echo.
exit /b 0