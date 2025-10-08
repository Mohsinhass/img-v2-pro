# 🚀 Img V2 Pro - Setup Guide for Testing

This guide will help you get the Img V2 Pro image converter running quickly for testing and development.

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.10+** - [Download here](https://python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## 🎯 Quick Start (Basic Features)

For basic image conversion (JPG, PNG, WEBP, SVG), you only need the frontend:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "img v2 pro final round"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

The app will open at `http://localhost:5173`

✅ **You can now convert JPG, PNG, WEBP, and SVG files!**

## 🔥 Full Setup (HEIC Support + All Features)

For complete functionality including HEIC/HEIF conversion:

### 1. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Copy environment file
copy .env.example .env
```

### 2. Backend Setup
```bash
# Navigate to backend folder
cd heif-convert

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env
```

### 3. Start Both Services
```bash
# Terminal 1 - Frontend (in root folder)
npm start

# Terminal 2 - Backend (in heif-convert folder)
uvicorn api.main:app --host 0.0.0.0 --port 5001 --reload
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Docs**: http://localhost:5001/docs

## ✨ What You Can Test

### Core Features (No Setup Required)
- ✅ Image format conversion (JPG ↔ PNG ↔ WEBP)
- ✅ SVG vectorization 
- ✅ PDF to image conversion
- ✅ Images to PDF compilation
- ✅ Batch processing
- ✅ Drag & drop upload
- ✅ Image editor tools

### Advanced Features (With Backend)
- ✅ HEIC/HEIF conversion
- ✅ Additional formats (TIFF, BMP, GIF, ICO)
- ✅ Contact form
- ✅ Higher quality processing

### Premium Features (Optional)
- ✅ User authentication (requires Supabase)
- ✅ Payment processing (requires Stripe)
- ✅ Conversion history
- ✅ Cloud storage

## 🔧 Optional Services Setup

### Supabase (For User Accounts)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Add keys to `.env`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Stripe (For Payments)
1. Create account at [stripe.com](https://stripe.com)
2. Get test keys from dashboard
3. Add to `.env`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
4. Add to `heif-convert/.env`:
```
STRIPE_SECRET_KEY=sk_test_...
```

## 🎮 Test Cases to Try

1. **Basic Conversion**: Upload a JPG, convert to PNG
2. **Batch Processing**: Upload multiple images, convert all to WEBP
3. **HEIC Conversion**: Upload HEIC file (iPhone photo), convert to JPG
4. **PDF Tools**: Upload PDF, extract first page as image
5. **Image Editor**: Upload image, crop/resize/rotate
6. **SVG Creation**: Upload JPG, convert to SVG vector

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change ports if needed
npm start -- --port 3000
```

### Python Issues
```bash
# Use virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### HEIC Not Working
- Make sure backend is running on port 5001
- Check console for connection errors
- Verify pillow-heif is installed

## 📱 Mobile Testing

The app is fully responsive! Test on:
- Desktop browsers
- Mobile browsers
- Tablet browsers

## 🚀 Sharing with Others

### Option 1: GitHub Repository
1. Push code to GitHub
2. Share repository link
3. Others follow this setup guide

### Option 2: Cloud Deployment
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Backend**: Deploy to Railway, Render, or Heroku

### Option 3: Local Network Sharing
```bash
# Start with network access
npm start -- --host 0.0.0.0
# Share your IP: http://YOUR_IP:5173
```

## 💡 Pro Tips

- Use **Chrome DevTools** to test mobile responsiveness
- Check **Network tab** to see API calls
- **Clear browser cache** if you see old versions
- **Check console logs** for any errors

## 🆘 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Make sure ports 5173 and 5001 are available
4. Try clearing browser cache and localStorage

---

**Happy testing! 🎉**

The app works great even with just the basic setup - your friend can convert images immediately after running `npm start`!