# Google Calendar Sync - Complete Setup Guide

## 🚨 IMPORTANT: This feature is PARTIALLY IMPLEMENTED

The backend infrastructure is complete, but frontend integration needs completion. Use this guide to:
1. Set up the backend completely
2. Deploy to Railway
3. Complete the frontend integration (instructions below)

---

## 0. Pre-Deployment: Understanding Secrets & Setup

### A. Required Environment Variables for Railway

Add these in Railway's "Variables" tab:

#### 1. **GOOGLE_CLIENT_ID**
- **What**: Your Google OAuth 2.0 Client ID
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Create new project or select existing
  3. Enable "Google Calendar API":
     - APIs & Services → Library
     - Search "Google Calendar API"
     - Click "Enable"
  4. Create credentials:
     - APIs & Services → Credentials
     - "Create Credentials" → "OAuth 2.0 Client ID"
     - Application type: "Web application"
     - Name: "StudyForge"
     - Authorized redirect URIs: `https://YOUR-RAILWAY-URL.railway.app/api/auth/callback/google`
  5. Copy the Client ID
- **Example**: `123456789-abc123def456.apps.googleusercontent.com`

#### 2. **GOOGLE_CLIENT_SECRET**
- **What**: Your Google OAuth 2.0 Client Secret
- **How to get**: Same screen as Client ID above
- **Example**: `GOCSPX-abc123xyz456def789`

#### 3. **NEXTAUTH_SECRET**
- **What**: Random secret for session encryption
- **How to generate**:
  ```bash
  openssl rand -base64 32
  ```
  Or use: https://generate-secret.vercel.app/32
- **Example**: `k8fJ2mP9nQ5rS6tU7vW8xY9zA1bC2dE3fG4hI5jK6lM=`

#### 4. **NEXTAUTH_URL**
- **What**: Your full application URL
- **When to set**: After Railway generates your domain
- **Example**: `https://studyforge-production-abc123.railway.app`
- **Note**: Update this after first deploy

#### 5. **DATABASE_URL**
- **What**: PostgreSQL connection string
- **How to get**: Railway auto-provides this
- **Action**: Add PostgreSQL service in Railway, it auto-injects this variable

---

### B. Backend Dependencies Explained

#### **next-auth** (v4.24.5)
- **Purpose**: Complete OAuth authentication solution
- **Why**: Handles Google OAuth flow, sessions, JWT tokens automatically
- **Features**: Sign in/out, session management, token refresh

#### **@next-auth/prisma-adapter** (v1.0.7)
- **Purpose**: Connect NextAuth to Prisma database
- **Why**: Stores sessions and user data in PostgreSQL

#### **@prisma/client** (v5.7.1)
- **Purpose**: Database ORM (Object-Relational Mapping)
- **Why**: Type-safe database queries, migrations, schema management

#### **googleapis** (v129.0.0)
- **Purpose**: Official Google APIs Node.js client
- **Why**: Makes requests to Google Calendar API for creating/updating events

#### **prisma** (v5.7.1 - devDependency)
- **Purpose**: CLI tool for database migrations
- **Why**: Generate Prisma Client, run migrations, manage schema

---

### C. Database Schema Explained

#### **User Table** (`users`)
```prisma
id                String      // Unique user ID (auto-generated)
email             String      // User's email (unique)
name              String?     // Display name (optional)
googleId          String?     // Google account ID (unique)
googleAccessToken String?     // Google OAuth access token (encrypted)
googleRefreshToken String?    // Google OAuth refresh token (encrypted)
googleTokenExpiry DateTime?   // When access token expires
```
**Purpose**: Stores user authentication data and Google Calendar tokens

#### **Assignment Table** (`assignments`)
```prisma
id              String      // Unique assignment ID
userId          String      // Links to User table
title           String      // Assignment title
subject         String      // Subject/course name
difficulty      String      // Easy/Medium/Hard
timeEstimate    Int         // Estimated minutes
dueDate         String      // Due date (YYYY-MM-DD)
notes           String?     // Additional notes
googleEventId   String?     // Google Calendar event ID (null if not synced)
syncedAt        DateTime?   // When it was synced to calendar
```
**Purpose**: Stores homework assignments and tracks Google Calendar sync status

#### **Session Table** (`sessions`) - NextAuth
```prisma
id           String      // Session ID
sessionToken String      // Encrypted session token
userId       String      // Links to User
expires      DateTime    // When session expires
```
**Purpose**: Manages active user sessions for authentication

#### **Account Table** (`accounts`) - NextAuth
```prisma
id                String  // Account ID
userId            String  // Links to User
provider          String  // OAuth provider (google)
providerAccountId String  // Google account ID
access_token      String? // OAuth access token
refresh_token     String? // OAuth refresh token
expires_at        Int?    // Token expiration timestamp
```
**Purpose**: Stores OAuth provider account details

---

## 1. Railway Deployment Steps

### Step 1: Prepare Your Repository

```bash
# Commit all changes
git add .
git commit -m "Add Google Calendar sync feature"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your StudyForge repository
5. Select branch: `claude/build-studyforge-app-01HXWfxYuHhQKdv9D4X5baLU` or `main`

### Step 3: Add PostgreSQL Database

1. In Railway project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway automatically creates `DATABASE_URL` variable

### Step 4: Add Environment Variables

Go to your service → "Variables" tab:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://your-app.railway.app
DATABASE_URL=(auto-injected by Railway)
```

**IMPORTANT**: You'll need to update `NEXTAUTH_URL` after first deploy!

### Step 5: Update Google OAuth Redirect URI

1. Go back to Google Cloud Console
2. Edit your OAuth 2.0 Client
3. Add to "Authorized redirect URIs":
   ```
   https://YOUR-RAILWAY-URL.railway.app/api/auth/callback/google
   ```
4. Save changes

### Step 6: Run Database Migration

Railway will automatically run `prisma generate` during build (see `package.json` postinstall script).

For manual migration:
```bash
npx prisma migrate deploy
```

### Step 7: Verify Deployment

1. Open your Railway app URL
2. Check that homepage loads
3. Try clicking "Connect Google Calendar" button
4. Verify Google OAuth flow works

---

## 2. Frontend Integration - COMPLETE THIS

The backend is ready, but you need to integrate sync buttons into the UI.

### Update `components/AssignmentList.tsx`

Add this import at the top:
```typescript
import SyncButton from './SyncButton';
```

Inside the assignment card (around line 84), add after the badges section:
```typescript
<div className="mt-3">
  <SyncButton
    assignmentId={assignment.id}
    isSynced={!!assignment.googleEventId}
    onSyncSuccess={(eventId) => {
      // Refresh assignments or update state
      console.log('Synced!', eventId);
    }}
  />
</div>
```

### Update `app/page.tsx`

Add Google Calendar button to the header:

```typescript
import GoogleCalendarButton from '@/components/GoogleCalendarButton';

// In the render, add before the form grid:
<div className="mb-8 flex justify-center">
  <GoogleCalendarButton />
</div>
```

### Convert to API-based Storage

Replace LocalStorage calls with API calls:

```typescript
// Instead of:
storageUtils.addAssignment(assignment);

// Use:
await api.createAssignment(assignment);

// Instead of:
storageUtils.getAssignments();

// Use:
await api.getAssignments();

// Instead of:
storageUtils.deleteAssignment(id);

// Use:
await api.deleteAssignment(id);
```

---

## 3. Testing Checklist

- [ ] Sign in with Google works
- [ ] Google Calendar permission prompt appears
- [ ] After auth, "Calendar Connected" badge shows
- [ ] Can create assignments
- [ ] "Sync to Calendar" button appears on each assignment
- [ ] Clicking sync creates event in Google Calendar
- [ ] Synced assignments show "Synced" badge
- [ ] Deleting assignment removes calendar event
- [ ] Tokens refresh automatically when expired

---

## 4. Troubleshooting

### Error: "Unauthorized" when syncing
**Cause**: User not signed in or session expired
**Fix**: Sign out and sign in again

### Error: "Google Calendar not connected"
**Cause**: OAuth flow didn't store tokens
**Fix**:
1. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Verify redirect URI matches exactly
3. Check database for user's `googleAccessToken`

### Error: "Failed to create calendar event"
**Cause**: Token expired or invalid scopes
**Fix**:
1. Sign out and sign in again to get fresh tokens
2. Verify calendar scope in OAuth config:
   ```typescript
   scope: 'openid email profile https://www.googleapis.com/auth/calendar'
   ```

### Database connection errors
**Cause**: `DATABASE_URL` not set or PostgreSQL not running
**Fix**: Verify PostgreSQL service exists in Railway and `DATABASE_URL` is auto-injected

---

## 5. Security Notes

### Token Storage
- Access tokens stored in database (encrypted in production with proper setup)
- Refresh tokens used to get new access tokens automatically
- Sessions use database strategy (not JWT) for better security

### API Protection
- All API routes check authentication via `getServerSession()`
- User can only access their own assignments
- Calendar operations require valid Google tokens

### Best Practices
- Never commit `.env` files
- Rotate `NEXTAUTH_SECRET` if compromised
- Use HTTPS only (Railway provides this)
- Monitor Google Cloud Console for suspicious activity

---

## 6. Features Implemented

✅ Google OAuth 2.0 flow
✅ Database storage for users and assignments
✅ Token management and auto-refresh
✅ Google Calendar event creation
✅ Event deletion on assignment delete
✅ Sync status tracking
✅ Session management
✅ API endpoints for all operations
✅ Frontend auth components
✅ Sync button component

## 7. Next Steps

1. **Deploy backend** following steps above
2. **Test OAuth flow** to ensure Google login works
3. **Integrate sync buttons** into assignment UI
4. **Convert storage** from LocalStorage to API
5. **Test end-to-end** sync functionality
6. **Add error handling** UI improvements
7. **Consider adding**:
   - Bulk sync all assignments
   - Calendar event color customization
   - Sync status page
   - Email notifications

---

## Quick Reference: API Endpoints

```
POST   /api/auth/signin/google          // Google OAuth login
GET    /api/auth/signout                // Sign out

GET    /api/assignments                 // Get all assignments
POST   /api/assignments                 // Create assignment
DELETE /api/assignments/[id]            // Delete assignment
POST   /api/assignments/[id]/sync       // Sync to Google Calendar

GET    /api/calendar/status             // Check if calendar connected
```

---

**Questions or issues?** Check Railway logs and browser console for detailed error messages.
