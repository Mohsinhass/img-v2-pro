# 🌐 Update Frontend for Live Backend

After deploying your backend to Railway/Render/Heroku, you'll get a live URL like:
- Railway: `https://your-app-railway.up.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app.herokuapp.com`

## Step 1: Update Vite Config

Edit `vite.config.mjs` and add your live backend URL:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://your-live-backend-url.com', // 👈 Update this!
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'build'
  }
})
```

## Step 2: Update API Calls

Check your JavaScript files for any hardcoded localhost URLs:

### In src/utils/api.js (if exists):
```javascript
// Before:
const API_BASE = 'http://localhost:5000'

// After:
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-live-backend-url.com'  // 👈 Your live backend
  : 'http://localhost:5000'
```

### In any component making API calls:
```javascript
// Before:
fetch('http://localhost:5000/convert', {...})

// After: 
fetch('/api/convert', {...})  // Uses proxy in dev, direct in production
```

## Step 3: Environment Variables

Create `.env.production`:

```
VITE_API_URL=https://your-live-backend-url.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
```

Update your code to use environment variables:

```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

## Step 4: Rebuild and Deploy

1. Run: `npm run build`
2. Upload new `build` folder to Netlify
3. Test your live app!

## Step 5: Test Your Live App

✅ Visit your Netlify URL
✅ Try uploading a HEIC image
✅ Test the conversion process
✅ Verify payment flow works
✅ Share with friends!

## Common Issues:

### CORS Errors
Your backend should have this in `heic_backend.py`:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["https://your-netlify-url.netlify.app"])
```

### Mixed Content (HTTP/HTTPS)
Make sure both frontend and backend use HTTPS in production.

### API Not Found
Double-check your backend URL is correct and the service is running.

---

## Quick Commands:

```bash
# Build for production
npm run build

# Test build locally
npx serve build

# Check for any hardcoded localhost URLs
grep -r "localhost" src/
```

Your app will be fully live and accessible worldwide! 🚀