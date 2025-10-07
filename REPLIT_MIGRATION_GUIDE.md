# Hathak Platform - Replit Setup Guide

## Quick Migration Steps:

### 1. Create New Replit Project
- Go to https://replit.com
- Click "Create Repl"
- Choose "Node.js" template
- Name it "hathak-platform"

### 2. Upload Your Code
- Use Replit's file upload feature
- Or connect to GitHub repository
- Upload both `frontend/` and `backend/` folders

### 3. Configure Replit Settings

#### A. Create `.replit` file:
```json
{
  "run": "npm run dev:replit",
  "modules": ["nodejs-18"],
  "env": {
    "NODE_ENV": "development",
    "NODE_OPTIONS": "--max-old-space-size=1024"
  }
}
```

#### B. Update `package.json` scripts:
```json
{
  "scripts": {
    "dev:replit": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "start:replit": "concurrently \"cd backend && npm start\" \"cd frontend && npm start\""
  }
}
```

### 4. Install Dependencies
```bash
# In Replit terminal:
cd backend && npm install
cd ../frontend && npm install
```

### 5. Start Development
```bash
npm run dev:replit
```

## Benefits:
- ✅ Zero local RAM/CPU usage
- ✅ Always-on development server
- ✅ Automatic HTTPS URLs
- ✅ Collaborative features
- ✅ Version control integration
- ✅ Free tier available

## URLs After Setup:
- Frontend: `https://your-repl-name.your-username.repl.co`
- Backend: `https://your-repl-name.your-username.repl.co/api`

## Alternative: GitHub Codespaces
- Free 120 hours/month
- Full VS Code experience
- More powerful than Replit
- Better for complex projects
