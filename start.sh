#!/bin/sh
set -e

echo "🚀 StudyForge Starting..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Validate critical environment variables
echo "📋 Validating environment variables..."

if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set"
  exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "❌ ERROR: NEXTAUTH_SECRET is not set"
  exit 1
fi

if [ -z "$GOOGLE_CLIENT_ID" ]; then
  echo "⚠️  WARNING: GOOGLE_CLIENT_ID is not set (Google OAuth will not work)"
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "⚠️  WARNING: GOOGLE_CLIENT_SECRET is not set (Google OAuth will not work)"
fi

# Set default PORT if not provided
PORT=${PORT:-3000}
echo "📍 PORT: $PORT"

# Set NEXTAUTH_URL if not already set
if [ -z "$NEXTAUTH_URL" ]; then
  if [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
    export NEXTAUTH_URL="https://$RAILWAY_PUBLIC_DOMAIN"
    echo "📍 NEXTAUTH_URL (auto-detected): $NEXTAUTH_URL"
  else
    export NEXTAUTH_URL="http://localhost:$PORT"
    echo "📍 NEXTAUTH_URL (fallback): $NEXTAUTH_URL"
  fi
else
  echo "📍 NEXTAUTH_URL: $NEXTAUTH_URL"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start the application
echo "🎯 Starting Next.js server on port $PORT..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exec node server.js
