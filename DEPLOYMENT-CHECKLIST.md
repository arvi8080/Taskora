# Deployment Checklist: Render (Backend) + Vercel (Frontend)

## Prerequisites
- [ ] GitHub account with the code pushed
- [ ] Vercel account (free)
- [ ] Render account (free)
- [ ] MongoDB Atlas account (free cluster)

---

## Step 1: Push Code to GitHub
```
bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2: Deploy Backend to Render

### Option A: Using Blueprint (Recommended)
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the `backend/render.yaml` file
5. Click "Create Blueprint"
6. Wait for deployment to complete

### Option B: Manual Setup
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGODB_URI=your-mongodb-atlas-uri`
   - `FRONTEND_URL=your-vercel-url.vercel.app`
   - `JWT_SECRET=your-secret-key`
6. Click "Deploy"

### Get Your Backend URL
After deployment, note your backend URL (e.g., `https://expert-service-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### Option A: Using Dashboard (Recommended)
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
5. Add Environment Variables:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
6. Click "Deploy"

### Option B: Using Vercel CLI
```
bash
cd frontend
npm i -g vercel
vercel
# Follow the prompts
# Set REACT_APP_API_URL environment variable
```

### Get Your Frontend URL
After deployment, note your frontend URL (e.g., `https://your-project.vercel.app`)

---

## Step 4: Configure CORS (Important!)

1. Go to Render dashboard → Your backend service
2. Navigate to "Environment Variables"
3. Update `FRONTEND_URL` with your actual Vercel URL:
   
```
   FRONTEND_URL=https://your-project.vercel.app
   
```
4. Redeploy the backend (click "Deploy" button)

---

## Step 5: Verify Deployment

### Test Backend Health
```
bash
curl https://your-backend.onrender.com/api/health
```

### Test Frontend
Open https://your-project.vercel.app in your browser

### Test API Connection
1. Open the frontend in your browser
2. Try to register/login
3. Check browser console for any errors

---

## Environment Variables Summary

### Backend (Render)
| Variable | Example Value |
|----------|---------------|
| NODE_ENV | production |
| PORT | 10000 |
| MONGODB_URI | mongodb+srv://... |
| JWT_SECRET | your-random-secret |
| FRONTEND_URL | https://your-app.vercel.app |

### Frontend (Vercel)
| Variable | Example Value |
|----------|---------------|
| REACT_APP_API_URL | https://your-backend.onrender.com/api |

---

## Troubleshooting

### Frontend shows "Network Error"
- Check `REACT_APP_API_URL` in Vercel dashboard
- Should be: `https://your-backend.onrender.com/api`

### Backend CORS errors
- Check `FRONTEND_URL` in Render dashboard
- Should match your Vercel URL exactly

### Database connection errors
- Verify MongoDB Atlas cluster is running
- Check network access (allow all IPs for development)
- Verify connection string is correct

---

## Quick Deploy Commands

### Deploy Backend (using Render CLI)
```
bash
# Install Render CLI
npm install -g render-cli

# Deploy
render deploy --serviceBackend --commitRef main
```

### Deploy Frontend (using Vercel CLI)
```
bash
cd frontend
vercel --prod
```

---

## Cost (Free Tier)

| Service | Free Limits |
|---------|-------------|
| Vercel | 100GB bandwidth/month |
| Render | 750 hours/month |
| MongoDB Atlas | 512MB storage |

**Total: FREE** ✓
