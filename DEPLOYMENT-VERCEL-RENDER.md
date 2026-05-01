# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide covers deploying the ExpertService application using **Vercel** for the frontend and **Render** for the backend.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Vercel        │         │   Render        │
│   (Frontend)    │────────▶│   (Backend)     │
│   React App     │         │   Node.js API   │
└─────────────────┘         └─────────────────┘
         │                         │
         │                         │
         ▼                         ▼
   ┌─────────────────────────────────────────┐
   │            MongoDB Atlas               │
   │            (Free Cluster)               │
   └─────────────────────────────────────────┘
```

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

---

## Step 1: Deploy Backend to Render

### Option A: Using Render Blueprint (render.yaml)

1. **Push your code to GitHub**
   
```
bash
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   
```

2. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the `backend/render.yaml` file

3. **Configure Environment Variables**
   - After the service is created, go to "Environment" tab
   - Add these required variables:
     
```
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expertservice?retryWrites=true&w=majority
     FRONTEND_URL=https://your-vercel-frontend.vercel.app
     JWT_SECRET=your-random-secret-key
     
```
   - Add optional variables as needed (from `backend/env.example`)

4. **Deploy**
   - Click "Create Blueprint"
   - Wait for deployment to complete
   - Your backend will be available at: `https://expert-service-backend.onrender.com`

### Option B: Manual Render Setup

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   
```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-atlas-uri>
   FRONTEND_URL=https://your-vercel-frontend.vercel.app
   JWT_SECRET=<your-secret>
   
```
6. Click "Deploy"

---

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App` (or `Other`)
   - **Root Directory**: `frontend`
5. Add Environment Variables:
   
```
   REACT_APP_API_URL=https://expert-service-backend.onrender.com/api
   
```
6. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   
```
bash
   npm i -g vercel
   
```

2. Deploy frontend:
   
```
bash
   cd frontend
   vercel
   
```

3. Set environment variable:
   
```
bash
   vercel env add REACT_APP_API_URL
   # Enter: https://expert-service-backend.onrender.com/api
   
```

---

## Step 3: Configure CORS on Backend

After deploying both services:

1. Go to your Render backend dashboard
2. Navigate to "Environment Variables"
3. Update `FRONTEND_URL` with your actual Vercel URL:
   
```
   FRONTEND_URL=https://your-project.vercel.app
   
```
4. Redeploy the backend (click "Deploy" button)

---

## Step 4: Set Up MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. **Create Account** → **Create Free Cluster**
3. **Configure Cluster**:
   - Choose AWS as provider
   - Select nearest region
4. **Create Database User**:
   - Username: `expertservice`
   - Password: `<generate-strong-password>`
5. **Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
6. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `expertservice`
7. Use this connection string as `MONGODB_URI` in Render

---

## Environment Variables Summary

### Backend (Render)
| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Set to `production` | Yes |
| PORT | Set to `10000` | Yes |
| MONGODB_URI | MongoDB Atlas connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| FRONTEND_URL | Your Vercel frontend URL | Yes |
| JWT_EXPIRE | Token expiration time (e.g., `7d`) | No |
| OPENAI_API_KEY | OpenAI API key | No |
| STRIPE_SECRET_KEY | Stripe secret key | No |
| AGORA_APP_ID | Agora video SDK App ID | No |
| GOOGLE_MAPS_API_KEY | Google Maps API key | No |

### Frontend (Vercel)
| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_API_URL | Backend API URL (e.g., `https://expert-service-backend.onrender.com/api`) | Yes |

---

## Troubleshooting

### Frontend can't connect to Backend
1. Check `REACT_APP_API_URL` in Vercel - should point to Render backend
2. Check `FRONTEND_URL` in Render backend - should point to Vercel frontend
3. Check CORS configuration in backend/server.js

### Backend deployment fails
1. Check build logs in Render dashboard
2. Ensure all required environment variables are set
3. Verify Node.js version compatibility

### Database connection issues
1. Verify MongoDB Atlas cluster is running
2. Check network access settings (allow all IPs for development)
3. Verify connection string is correct

---

## Useful Commands

### Test Backend API
```
bash
curl https://your-backend.onrender.com/api/health
```

### View Backend Logs
- Go to Render dashboard → Your backend service → "Logs" tab

### Redeploy Backend
- Go to Render dashboard → Your backend service → Click "Deploy"

### Redeploy Frontend
- Push to main branch or use Vercel dashboard

---

## Cost Summary

| Service | Free Tier Limits |
|---------|------------------|
| Vercel | 100GB bandwidth/month, 500 build minutes/month |
| Render | 750 hours/month for web services, free PostgreSQL (optional) |
| MongoDB Atlas | 512MB storage, shared RAM |

**Total Cost: FREE** ✓
