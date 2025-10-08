@echo off
echo ==========================================
echo   Img V2 Pro - Quick Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo ✅ npm found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating environment file...
    copy .env.example .env >nul 2>&1
    echo ✅ Environment file created
    echo.
)

echo ==========================================
echo   🚀 Setup Complete!
echo ==========================================
echo.
echo The basic image converter is ready to use!
echo.
echo To start the application:
echo   npm start
echo.
echo Then open: http://localhost:5173
echo.
echo For HEIC support, also run the backend:
echo   cd heif-convert
echo   pip install -r requirements.txt
echo   uvicorn api.main:app --port 5001
echo.
echo ==========================================
echo.
echo Would you like to start the app now? (y/n)
set /p choice="Enter choice: "

if /i "%choice%"=="y" (
    echo.
    echo 🚀 Starting Img V2 Pro...
    echo.
    echo The app will open in your browser at http://localhost:5173
    echo Press Ctrl+C to stop the server when done.
    echo.
    npm start
) else (
    echo.
    echo Setup complete! Run 'npm start' when ready.
    echo Press any key to exit...
    pause >nul
)