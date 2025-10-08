@echo off
title Img V2 Pro - Full Stack Auto Start

echo ==========================================
echo   🚀 Starting Img V2 Pro (Full Stack)
echo ==========================================
echo.
echo This will automatically start:
echo • Frontend (React) on http://localhost:5173
echo • Backend (FastAPI) on http://localhost:5001
echo.
echo Both will run simultaneously in separate windows.
echo.

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

REM Setup backend environment if needed
if not exist "heif-convert\.venv" (
    echo 📦 Setting up backend environment...
    cd heif-convert
    python -m venv .venv
    call .venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

echo ✅ Dependencies ready!
echo.
echo 🚀 Starting services...
echo.

REM Start backend in a new window (persistent)
start "🔧 Img V2 Pro - Backend API" cmd /k "cd /d "%~dp0heif-convert" && call .venv\Scripts\activate && echo ✅ Backend starting on http://localhost:5001 && echo 📖 API docs: http://localhost:5001/docs && echo. && uvicorn api.main:app --host 0.0.0.0 --port 5001 --reload"

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend in this window
echo 🎨 Starting frontend on http://localhost:5173...
echo.
echo 🌐 Your app will open automatically!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5001
echo 📖 API Docs: http://localhost:5001/docs
echo.
echo Press Ctrl+C to stop the frontend.
echo The backend runs in a separate window.
echo.

npm start