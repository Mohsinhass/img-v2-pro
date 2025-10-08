@echo off
title Img V2 Pro - Full Demo

echo ==========================================
echo   🚀 Img V2 Pro - Full Demo Launcher
echo ==========================================
echo.
echo This will start both frontend and backend
echo for the complete experience including HEIC support.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo 📦 Checking dependencies...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install from https://python.org/
    pause
    exit /b 1
)

echo ✅ All dependencies found!
echo.

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Install backend dependencies if needed
if not exist "heif-convert\venv" (
    echo 📦 Setting up backend environment...
    cd heif-convert
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

echo ✅ All dependencies ready!
echo.
echo 🚀 Starting Img V2 Pro...
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5001
echo.
echo Press Ctrl+C in either window to stop.
echo.

REM Start backend in a new window
start "Img V2 Pro Backend" cmd /k "cd heif-convert && python -m venv venv && call venv\Scripts\activate && uvicorn api.main:app --host 0.0.0.0 --port 5001 --reload"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend...
npm start