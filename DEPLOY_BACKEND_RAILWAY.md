# 🚀 Deploy Backend to Railway via GitHub

## Step 1: Push to GitHub

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Img V2 Pro with backend"
```

### 2. Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name it: `img-v2-pro` or `image-converter-pro`
4. Keep it public for free deployment
5. Click "Create repository"

### 3. Push Your Code
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend on Railway

### 1. Sign Up for Railway
- Go to [railway.app](https://railway.app)
- Sign up with your GitHub account
- Connect your GitHub repository

### 2. Deploy Your Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will automatically detect it's a Python app
5. It will deploy both your Flask backend AND FastAPI backend

### 3. Configure Environment Variables
In Railway dashboard, add these environment variables:
```
PORT=5001
PYTHONPATH=/app
```

### 4. Update Your Frontend
Once deployed, Railway gives you a URL like: `https://your-app.railway.app`

Update your frontend to use this URL instead of localhost.

## Step 3: Frontend Configuration

Update your Vite config to use the live backend:

```javascript
// vite.config.mjs
export default defineConfig({
  // ... existing config
  server: {
    proxy: {
      '/api': {
        target: 'https://your-app.railway.app', // Your Railway URL
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
```

## Benefits of This Approach:
✅ **Free hosting** for both frontend and backend
✅ **Automatic deployments** when you push to GitHub
✅ **HTTPS included** - secure by default
✅ **Scalable** - handles traffic automatically
✅ **Easy updates** - just push to GitHub