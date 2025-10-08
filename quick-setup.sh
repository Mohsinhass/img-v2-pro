#!/bin/bash

echo "=========================================="
echo "   Img V2 Pro - Quick Setup Script"
echo "=========================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

echo "✅ Node.js found"
echo

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available!"
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

echo "✅ npm found"
echo

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env 2>/dev/null
    echo "✅ Environment file created"
    echo
fi

echo "=========================================="
echo "   🚀 Setup Complete!"
echo "=========================================="
echo
echo "The basic image converter is ready to use!"
echo
echo "To start the application:"
echo "  npm start"
echo
echo "Then open: http://localhost:5173"
echo
echo "For HEIC support, also run the backend:"
echo "  cd heif-convert"
echo "  pip install -r requirements.txt"
echo "  uvicorn api.main:app --port 5001"
echo
echo "=========================================="
echo
echo "Would you like to start the app now? (y/n)"
read -p "Enter choice: " choice

if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
    echo
    echo "🚀 Starting Img V2 Pro..."
    echo
    echo "The app will open in your browser at http://localhost:5173"
    echo "Press Ctrl+C to stop the server when done."
    echo
    npm start
else
    echo
    echo "Setup complete! Run 'npm start' when ready."
    echo "Press any key to exit..."
    read -n 1
fi