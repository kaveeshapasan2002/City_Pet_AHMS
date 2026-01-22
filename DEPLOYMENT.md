# Deployment Guide - Pet Hospital Management System

This guide will help you deploy your full-stack Pet Hospital Management System to make it live for your portfolio.

## Architecture
- **Frontend**: React application (Deploy to Vercel)
- **Backend**: Node.js/Express API (Deploy to Render)
- **Database**: MongoDB Atlas (Already configured)
- **Real-time**: Socket.IO for messaging

## Prerequisites
- GitHub account (for code hosting)
- Vercel account (for frontend) - https://vercel.com
- Render account (for backend) - https://render.com
- MongoDB Atlas database (already have)

---

## Part 1: Prepare Your Code

### 1.1 Initialize Git Repository (if not already done)
```bash
cd /Users/kaveeshaathukorala/github/Untitled
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "pet-hospital-system")
3. Push your code:
```bash
git remote add origin https://github.com/YOUR-USERNAME/pet-hospital-system.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Render

### 2.1 Sign Up/Login to Render
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository
4. Configure:
   - **Name**: `pet-hospital-backend` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Add Environment Variables
In Render dashboard, go to **"Environment"** tab and add:

```
PORT=5001
MONGO_URI=mongodb+srv://kaveesha:Kaveesha123@cluster0.ycw4c.mongodb.net/animalHospitalDB?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_change_this_in_production
EMAIL_USER=kaveeshatech@gmail.com
EMAIL_PASS=ipsl tfjy ckzg zwbv
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

**Important**: 
- Change `JWT_SECRET` to a strong random string
- You'll update `FRONTEND_URL` after deploying frontend

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://pet-hospital-backend.onrender.com`)

**Note**: Free tier on Render spins down after inactivity. First request may take 30-60 seconds.

---

## Part 3: Deploy Frontend to Vercel

### 3.1 Sign Up/Login to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Add Environment Variable
In Vercel project settings, add:

```
REACT_APP_API_URL=https://pet-hospital-backend.onrender.com
```

(Replace with your actual Render backend URL from step 2.4)

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for build (3-5 minutes)
3. Copy your frontend URL (e.g., `https://pet-hospital.vercel.app`)

### 3.5 Update Backend CORS
1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Trigger a manual deploy to apply changes

---

## Part 4: Verify Deployment

### 4.1 Test Backend
Visit your backend URL in browser:
```
https://pet-hospital-backend.onrender.com/api/health
```
(You may need to add a health check endpoint)

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Try to:
   - Register a new user
   - Login
   - View pet records
   - Test real-time messaging
   - Check all features

---

## Part 5: Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Backend (Render)
1. Render free tier doesn't support custom domains
2. Upgrade to paid plan if needed

---

## Troubleshooting

### Backend Issues

**Problem**: 500 Internal Server Error
- Check Render logs: Dashboard → Logs
- Verify environment variables are set correctly
- Check MongoDB connection string

**Problem**: CORS errors
- Ensure `FRONTEND_URL` in backend matches your Vercel URL
- Check browser console for exact error

**Problem**: Slow first request
- Normal on Render free tier (cold start)
- Consider upgrading or use a paid service

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check backend is running on Render
- Open browser console to see errors

**Problem**: Environment variable not working
- Environment variables must start with `REACT_APP_`
- Redeploy after changing env vars
- Clear browser cache

---

## MongoDB Atlas Configuration

### Allow Render IP Address
1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production, restrict to specific IPs

---

## Monitoring & Maintenance

### Backend Monitoring
- Render provides logs and metrics
- Set up email notifications for deployment failures

### Frontend Monitoring
- Vercel provides analytics and logs
- Monitor Core Web Vitals

### Database
- MongoDB Atlas provides monitoring
- Set up alerts for storage/connection limits

---

## Cost Estimates

### Free Tier Limits
- **Render**: 750 hours/month, spins down after 15 min inactivity
- **Vercel**: 100 GB bandwidth, unlimited deployments
- **MongoDB Atlas**: 512 MB storage

### When to Upgrade
- High traffic (Render paid: $7/month)
- Need custom domain on backend
- Faster cold starts
- More storage (MongoDB: $9/month for 10GB)

---

## Portfolio Presentation

### What to Showcase
1. **Live Demo Link**: https://your-app.vercel.app
2. **GitHub Repository**: https://github.com/your-username/pet-hospital-system
3. **Features**:
   - User authentication & authorization
   - Real-time messaging with Socket.IO
   - Pet records management
   - Appointment scheduling
   - Invoice generation
   - Inventory management
   - AI-powered chatbot
   - Admin dashboard with analytics

### Demo Credentials (Create These)
```
Admin User:
Email: admin@pethospital.com
Password: Admin@123

Pet Owner:
Email: owner@example.com
Password: Owner@123
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test all features
4. ✅ Create demo accounts
5. ✅ Add project to portfolio
6. ✅ Update resume with live link
7. Consider adding:
   - Email verification (already have OTP)
   - Password reset functionality
   - File uploads (pet photos)
   - Payment integration
   - Mobile responsive improvements

---

## Support Links

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## Security Reminders

⚠️ **Before going live**:
- Change JWT_SECRET to a strong random value
- Never commit .env files to Git
- Use HTTPS only (both services provide this)
- Implement rate limiting
- Add input validation
- Review CORS settings

---

Good luck with your deployment! 🚀
