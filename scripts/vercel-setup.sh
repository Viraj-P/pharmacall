#!/bin/bash

# Vercel Deployment Setup Script
# This script helps set up Vercel deployment

set -e

echo "🚀 Vercel Deployment Setup"
echo "=========================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI $(vercel --version) detected"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo "✅ Logged in to Vercel as $(vercel whoami)"

# Create vercel.json if it doesn't exist
if [ ! -f "vercel.json" ]; then
    echo "📝 Creating vercel.json..."
    cat > vercel.json << EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
    "NEXT_PUBLIC_APP_URL": "@app_url",
    "APP_ENCRYPTION_KEY": "@encryption_key",
    "VOICE_PROVIDER": "@voice_provider",
    "RETELL_API_KEY": "@retell_api_key",
    "RETELL_AGENT_ID": "@retell_agent_id",
    "VAPI_API_KEY": "@vapi_api_key",
    "VAPI_ASSISTANT_ID": "@vapi_assistant_id",
    "VAPI_PHONE_NUMBER_ID": "@vapi_phone_number_id",
    "TWILIO_ACCOUNT_SID": "@twilio_account_sid",
    "TWILIO_AUTH_TOKEN": "@twilio_auth_token",
    "TWILIO_PHONE_NUMBER": "@twilio_phone_number",
    "RESEND_API_KEY": "@resend_api_key",
    "EMAIL_FROM": "@email_from",
    "NEXT_PUBLIC_SENTRY_DSN": "@sentry_dsn",
    "SENTRY_ORG": "@sentry_org",
    "SENTRY_PROJECT": "@sentry_project",
    "VOICE_WEBHOOK_SECRET": "@webhook_secret",
    "PHARMACIST_PHONE_NUMBER": "@pharmacist_phone"
  }
}
EOF
    echo "✅ Created vercel.json"
else
    echo "✅ vercel.json already exists"
fi

echo ""
echo "🎉 Vercel setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Run 'vercel --prod' to deploy"
echo ""
echo "Environment variables to set in Vercel:"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo "- And all other variables from your .env.local"
