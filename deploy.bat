@echo off
title Deploy Img V2 Pro

echo ==========================================
echo   🚀 Deploy Img V2 Pro to the Web
echo ==========================================
echo.
echo This will build your app for production
echo and prepare it for web deployment.
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

echo 🔨 Building production version...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    echo Please check for errors and try again.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo ==========================================
echo   📁 Your app is ready for deployment!
echo ==========================================
echo.
echo The 'build' folder contains your complete web app.
echo.
echo 🌐 Deployment Options:
echo.
echo 1. NETLIFY (Easiest - Drag & Drop)
echo    • Go to https://netlify.com
echo    • Drag the 'build' folder to deploy
echo    • Get instant live URL
echo.
echo 2. VERCEL (CLI Deployment)
echo    • Run: npm install -g vercel
echo    • Run: vercel --prod
echo    • Follow prompts
echo.
echo 3. GITHUB PAGES
echo    • Upload 'build' folder to GitHub
echo    • Enable Pages in repository settings
echo.
echo ==========================================
echo.
echo Would you like to:
echo [1] Open build folder
echo [2] Open Netlify in browser
echo [3] Install Vercel CLI
echo [4] Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo Opening build folder...
    explorer build
) else if "%choice%"=="2" (
    echo Opening Netlify...
    start https://netlify.com
) else if "%choice%"=="3" (
    echo Installing Vercel CLI...
    npm install -g vercel
    echo.
    echo Vercel installed! Run 'vercel --prod' to deploy.
) else (
    echo Deployment files ready in 'build' folder!
)

echo.
echo Happy deploying! 🎉
pause