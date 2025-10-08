@echo off
title Deploy Img V2 Pro to GitHub + Cloud

echo ==========================================
echo   🚀 Deploy Img V2 Pro to the Cloud
echo ==========================================
echo.
echo This will:
echo • Prepare your app for cloud deployment
echo • Push to GitHub
echo • Guide you through backend hosting setup
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo Please download and install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git found
echo.

REM Initialize git if not already done
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
    echo.
)

echo 📋 Current status:
git status

echo.
echo 📝 Adding all files to Git...
git add .

echo.
echo 💾 Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message="Deploy Img V2 Pro - Frontend and Backend ready"

git commit -m "%commit_message%"

echo.
echo ==========================================
echo   🌐 GitHub Repository Setup
echo ==========================================
echo.
echo Next steps:
echo.
echo 1. Go to https://github.com
echo 2. Click "New Repository"  
echo 3. Name it: img-v2-pro (or any name you like)
echo 4. Keep it PUBLIC for free hosting
echo 5. Do NOT initialize with README (you already have files)
echo 6. Click "Create Repository"
echo.
echo 7. Copy the repository URL (looks like: https://github.com/username/repo-name.git)
echo.

set /p repo_url="Paste your GitHub repository URL here: "

if "%repo_url%"=="" (
    echo ❌ No repository URL provided!
    echo You can push manually later with:
    echo git remote add origin YOUR_REPO_URL
    echo git branch -M main
    echo git push -u origin main
    pause
    exit /b 1
)

echo.
echo 🔗 Adding GitHub remote...
git remote add origin %repo_url%

echo.
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo ❌ Push failed! You might need to authenticate with GitHub.
    echo Try running: git push -u origin main
    pause
    exit /b 1
)

echo.
echo ✅ Successfully pushed to GitHub!
echo.
echo ==========================================
echo   ☁️ Backend Hosting Options
echo ==========================================
echo.
echo Choose your backend hosting platform:
echo.
echo [1] Railway (Recommended - Easiest)
echo [2] Render (Great free tier)
echo [3] Heroku (Classic choice)
echo [4] Skip backend hosting for now
echo.
set /p hosting_choice="Enter your choice (1-4): "

if "%hosting_choice%"=="1" (
    echo.
    echo 🚂 Railway Deployment:
    echo 1. Go to https://railway.app
    echo 2. Sign up with your GitHub account
    echo 3. Click "New Project" → "Deploy from GitHub repo"
    echo 4. Select your repository
    echo 5. Railway will auto-detect Python and deploy
    echo 6. Copy your Railway URL when ready
    echo.
    start https://railway.app
)

if "%hosting_choice%"=="2" (
    echo.
    echo 🎨 Render Deployment:
    echo 1. Go to https://render.com
    echo 2. Sign up with your GitHub account  
    echo 3. Click "New +" → "Web Service"
    echo 4. Connect your GitHub repository
    echo 5. Build Command: pip install -r requirements.txt
    echo 6. Start Command: python heic_backend.py
    echo 7. Copy your Render URL when ready
    echo.
    start https://render.com
)

if "%hosting_choice%"=="3" (
    echo.
    echo 💜 Heroku Deployment:
    echo 1. Go to https://heroku.com
    echo 2. Create account and install Heroku CLI
    echo 3. Run: heroku create your-app-name
    echo 4. Run: git push heroku main
    echo 5. Copy your Heroku URL when ready
    echo.
    start https://heroku.com
)

if "%hosting_choice%"=="4" (
    echo.
    echo 📱 Frontend-only deployment:
    echo Your frontend will work with basic features.
    echo You can add backend hosting later.
)

echo.
echo ==========================================
echo   📱 Frontend Deployment
echo ==========================================
echo.
echo For your frontend (Netlify):
echo 1. Run: npm run build
echo 2. Go to https://netlify.com  
echo 3. Drag your 'build' folder to deploy
echo 4. Update your site with the new build
echo.

choice /c YN /m "Build frontend now? (Y/N)"
if errorlevel 2 goto skip_build
if errorlevel 1 goto build_frontend

:build_frontend
echo.
echo 📦 Building frontend...
npm run build
echo.
echo ✅ Frontend built! 
echo Upload the 'build' folder to Netlify.
start https://netlify.com
goto end

:skip_build
echo.
echo Skipping frontend build.

:end
echo.
echo ==========================================
echo   🎉 Deployment Complete!
echo ==========================================
echo.
echo ✅ Code pushed to GitHub: %repo_url%
echo ✅ Backend deployment guide provided
echo ✅ Frontend ready for Netlify
echo.
echo Next steps:
echo 1. Complete backend hosting setup
echo 2. Update frontend build with backend URL
echo 3. Deploy updated frontend to Netlify
echo 4. Share your live app with friends!
echo.
echo 🚀 Your app will be live and accessible worldwide!
echo.
pause