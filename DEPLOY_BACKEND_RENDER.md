# 🌐 Deploy Backend to Render via GitHub

## Step 1: Prepare Your Backend for Render

### 1. Create requirements.txt for the main backend
```bash
# In your project root, create:
echo Flask >> requirements.txt
echo flask-cors >> requirements.txt
echo Pillow >> requirements.txt
echo pillow-heif >> requirements.txt
echo pymongo >> requirements.txt
echo python-dotenv >> requirements.txt
echo pyheif >> requirements.txt
```

### 2. Create a Procfile
```bash
# Create a file named "Procfile" (no extension) with:
web: python heic_backend.py
```

### 3. Update heic_backend.py for production
```python
# At the bottom of heic_backend.py, change:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
```

## Step 2: Push to GitHub
```bash
git add .
git commit -m "Prepare backend for deployment"
git push
```

## Step 3: Deploy on Render

### 1. Sign Up for Render
- Go to [render.com](https://render.com)
- Sign up with GitHub account

### 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `img-v2-pro-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python heic_backend.py`

### 3. Environment Variables
Add these in Render dashboard:
```
PORT=10000
FLASK_ENV=production
```

### 4. Deploy
Render will automatically deploy your backend and give you a URL like:
`https://img-v2-pro-backend.onrender.com`

## Benefits:
✅ **Free tier available**
✅ **Automatic SSL/HTTPS**
✅ **Auto-deploys from GitHub**
✅ **Built-in monitoring**