@echo off
title Build for Production Deployment

echo ==========================================
echo   🚀 Build Img V2 Pro for Production
echo ==========================================
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

REM Create production environment file if it doesn't exist
if not exist ".env.production" (
    echo 📝 Creating production environment file...
    copy .env.production.example .env.production >nul 2>&1
    echo ✅ Production environment file created
    echo Edit .env.production to add your API keys if needed
    echo.
)

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

echo 🔨 Building optimized production version...
echo This may take a moment...
echo.

npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    echo Please check for errors and try again.
    pause
    exit /b 1
)

echo.
echo ✅ Production build successful!
echo.
echo ==========================================
echo   📦 Your optimized app is ready!
echo ==========================================
echo.
echo 📁 Build folder: 'build' directory
echo 📊 Optimized for: Fast loading, mobile-friendly
echo 🌐 Ready for: Netlify, Vercel, any static host
echo.
echo 🚀 Deploy Options:
echo.
echo [1] NETLIFY (Recommended)
echo     • Go to https://netlify.com
echo     • Drag 'build' folder to deploy
echo     • Get instant live URL
echo.
echo [2] VERCEL
echo     • Install: npm install -g vercel
echo     • Run: vercel --prod
echo.
echo [3] OTHER HOSTS
echo     • Upload 'build' folder contents
echo     • Configure as static site
echo.
echo Would you like to:
echo [1] Open build folder
echo [2] Open Netlify deployment
echo [3] Show deployment guide
echo [4] Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo Opening build folder...
    explorer build
) else if "%choice%"=="2" (
    echo Opening Netlify...
    start https://app.netlify.com/drop
    echo Drag your 'build' folder to the deploy zone!
) else if "%choice%"=="3" (
    echo Opening deployment guide...
    start notepad DEPLOYMENT_GUIDE.md
) else (
    echo Build complete! Deploy the 'build' folder to any static host.
)

echo.
echo 🎉 Happy deploying!
pause