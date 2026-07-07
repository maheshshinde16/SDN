# Deployment Guide

## Overview

This guide covers deployment of the GrowEasy CSV Importer to production.

## Frontend Deployment (Vercel)

### Steps

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

2. **Set Environment Variables**
   - In Vercel Dashboard, go to Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` pointing to your backend

3. **Configure Build Settings**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy**
   - Vercel automatically deploys on `git push`
   - Monitor deployments in dashboard

## Backend Deployment (Railway/Render)

### Option 1: Railway

1. **Create Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "GitHub Repo"
   - Choose your repository

3. **Add Environment Variables**
   - CLAUDE_API_KEY=your_key
   - PORT=5000
   - FRONTEND_URL=your_vercel_url

4. **Deploy**
   - Railway auto-deploys on push
   - View logs in dashboard

### Option 2: Render

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Connect GitHub repo
   - Choose `backend` directory
   - Runtime: Node.js
   - Build: `npm install && npm run build`
   - Start: `npm start`

3. **Add Environment Variables**
   - Same as Railway

4. **Deploy**
   - Render auto-deploys on push

## Docker Deployment

### Build Images

```bash
# Backend
docker build -f backend/Dockerfile -t csv-importer-backend .
docker run -e CLAUDE_API_KEY=your_key -p 5000:5000 csv-importer-backend

# Frontend
docker build -f frontend/Dockerfile -t csv-importer-frontend .
docker run -e NEXT_PUBLIC_API_URL=http://backend:5000 -p 3000:3000 csv-importer-frontend
```

### Docker Compose

```bash
CLAUDE_API_KEY=your_key docker-compose up
```

## Environment Configuration

### Backend (.env)
```
CLAUDE_API_KEY=your_claude_api_key_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Monitoring

### Logs
- **Vercel**: Dashboard → Deployments → Logs
- **Railway**: Dashboard → Logs
- **Render**: Service → Logs

### Metrics
- Monitor API response times
- Track error rates
- Monitor AI API usage

## Performance Optimization

1. **Frontend**
   - Enable ISR (Incremental Static Regeneration)
   - Optimize images
   - Minify CSS/JS

2. **Backend**
   - Enable gzip compression
   - Cache responses
   - Monitor database queries

## Security

1. **Secrets Management**
   - Use platform secret management
   - Rotate API keys regularly
   - Never commit secrets

2. **CORS Configuration**
   - Lock to specific domains
   - Use HTTPS only
   - Validate origins

3. **Rate Limiting**
   - Implement API rate limiting
   - Protect against abuse
   - Monitor usage

## Scaling

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer
- Database connection pooling

### Vertical Scaling
- Increase server resources
- Upgrade plan
- Optimize code

## Rollback

### Vercel
```bash
vercel rollback
```

### Railway/Render
- Automatic rollback available
- Revert to previous deployment

## Monitoring & Alerts

Set up alerts for:
- API errors
- High latency
- Deployment failures
- API rate limit approaching
