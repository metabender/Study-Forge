# 🚀 Railway Deployment Guide - StudyForge

## ✅ Complete Railway Deployment Checklist

This guide will get your StudyForge app running on Railway with **ZERO 502 errors**.

---

## 📋 Pre-Deployment Checklist

### 1️⃣ **Set Up PostgreSQL Database**

1. Open your Railway project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Wait for provisioning to complete
4. Copy the `DATABASE_URL` from the PostgreSQL service variables

### 2️⃣ **Generate NextAuth Secret**

Run this command locally to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

**Save this value** - you'll need it in step 4.

### 3️⃣ **Configure Google OAuth Credentials**

#### A. Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **"APIs & Services"** → **"Library"**
4. Search for **"Google Calendar API"**
5. Click **"Enable"**

#### B. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Name it: `StudyForge Production`

#### C. Configure Authorized Redirect URIs

**CRITICAL:** Add this exact URL (replace with your Railway domain):

```
https://study-forge-production-1b4e.up.railway.app/api/auth/callback/google
```

To find your Railway domain:
- Go to your Railway project
- Click on your service
- Look for **"Domains"** section
- Copy the `*.up.railway.app` URL

#### D. Save Credentials

After creating:
1. Copy the **Client ID** (ends with `.apps.googleusercontent.com`)
2. Copy the **Client Secret** (starts with `GOCSPX-`)

**Keep these safe** - you'll need them in step 4.

---

## 🔧 Railway Configuration

### 4️⃣ **Add Environment Variables to Railway**

1. In Railway, click on your **StudyForge service**
2. Go to **"Variables"** tab
3. Click **"RAW Editor"**
4. Paste the following (with YOUR actual values):

```env
# Database (copy from PostgreSQL plugin)
DATABASE_URL=postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway

# NextAuth Secret (generated in step 2)
NEXTAUTH_SECRET=your-generated-secret-here

# Application URL (your Railway domain)
NEXTAUTH_URL=https://study-forge-production-1b4e.up.railway.app

# Google OAuth (from step 3)
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here
```

5. Click **"Update Variables"**

### 5️⃣ **Deploy to Railway**

#### Option A: From GitHub (Recommended)

1. Make sure all fixes are pushed to your main branch
2. Railway will auto-deploy on push
3. Watch the build logs for any errors

#### Option B: From Local Repository

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy
railway up
```

---

## 🔍 Verify Deployment

### 6️⃣ **Check Build Logs**

In Railway, watch for these success messages:

```
✅ Docker build successful
🗄️  Running database migrations...
✅ Migrations complete
🎯 Starting Next.js server on port 3000...
🔐 NextAuth configured with URL: https://your-app.up.railway.app
```

### 7️⃣ **Test Your Application**

1. Open your Railway app URL: `https://study-forge-production-1b4e.up.railway.app`
2. You should see the StudyForge homepage (NOT a 502 error)
3. Try clicking **"Connect Google Calendar"**
4. Complete the Google OAuth flow
5. Create a test assignment
6. Click **"Sync to Calendar"**
7. Check your Google Calendar to verify the event was created

---

## 🐛 Troubleshooting

### ❌ Still Getting 502 Error?

Check Railway logs for these common issues:

#### **Error: "NEXTAUTH_SECRET is not set"**
```bash
Solution: Add NEXTAUTH_SECRET to Railway variables (see step 4)
```

#### **Error: "DATABASE_URL is not set"**
```bash
Solution: Ensure PostgreSQL plugin is added and DATABASE_URL is copied correctly
```

#### **Error: "Prisma migration failed"**
```bash
Solution: Check DATABASE_URL format is correct
Format: postgresql://user:password@host:port/database
```

#### **OAuth Error: "redirect_uri_mismatch"**
```bash
Solution:
1. Go to Google Cloud Console → Credentials
2. Verify redirect URI matches EXACTLY:
   https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/auth/callback/google
3. No trailing slashes!
4. Must use HTTPS (not HTTP)
```

#### **Error: "Application failed to respond"**
```bash
Solution: Check that PORT environment variable is being used correctly
Railway logs should show: "Starting Next.js server on port XXXX"
```

### 🔄 Force Rebuild

If changes aren't applying:

1. Railway Dashboard → Your Service
2. Click **"Deployments"**
3. Click **"Redeploy"** on the latest deployment

---

## 📊 What's Been Fixed

This deployment now includes:

✅ **Automatic PORT detection** - Uses Railway's dynamic PORT
✅ **Database migrations** - Runs `prisma migrate deploy` on startup
✅ **Environment validation** - Checks all required vars before starting
✅ **Auto-configured NEXTAUTH_URL** - Detects Railway domain automatically
✅ **Proper error handling** - Clear logs for debugging
✅ **Startup script** - `start.sh` handles migrations + server startup
✅ **Production-ready Docker** - Multi-stage build with proper permissions

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Homepage loads without 502 error
- [ ] "Connect Google Calendar" button appears
- [ ] Google OAuth login works
- [ ] Can create assignments
- [ ] Can sync assignments to Google Calendar
- [ ] Events appear in Google Calendar
- [ ] No errors in Railway logs

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| **Railway Dashboard** | https://railway.app/dashboard |
| **Google Cloud Console** | https://console.cloud.google.com |
| **OAuth Credentials** | https://console.cloud.google.com/apis/credentials |
| **Calendar API** | https://console.cloud.google.com/apis/library/calendar-json.googleapis.com |

---

## 🆘 Need Help?

If you're still experiencing issues after following this guide:

1. Check Railway logs: `railway logs` or in the dashboard
2. Verify all environment variables are set correctly
3. Confirm Google OAuth redirect URI matches EXACTLY
4. Ensure PostgreSQL database is connected
5. Try a fresh deployment: Redeploy in Railway dashboard

---

## 🎯 Final Notes

### Google OAuth Redirect URI Format

**CORRECT:**
```
https://study-forge-production-1b4e.up.railway.app/api/auth/callback/google
```

**WRONG:**
```
http://study-forge-production-1b4e.up.railway.app/api/auth/callback/google  ❌ (http not https)
https://study-forge-production-1b4e.up.railway.app/api/auth/callback/google/ ❌ (trailing slash)
https://localhost:3000/api/auth/callback/google ❌ (localhost in production)
```

### Environment Variables Priority

Railway will use environment variables in this order:

1. **Explicit NEXTAUTH_URL** (if you set it in Railway variables)
2. **RAILWAY_PUBLIC_DOMAIN** (auto-detected)
3. **Fallback to localhost** (development only)

For production, either set `NEXTAUTH_URL` explicitly OR let Railway auto-detect via `RAILWAY_PUBLIC_DOMAIN`.

---

**Your app should now be live and working!** 🎊
