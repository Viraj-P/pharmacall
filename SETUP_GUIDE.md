# 🚀 PharmaCall Setup Guide

## Quick Setup Checklist

### Step 1: Database Setup (Supabase) - 5 minutes
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings → API
4. Copy these values:
   - Project URL
   - Anon (public) key
   - Service role key

### Step 2: Voice Provider Setup (Choose ONE)

#### Option A: Retell (Recommended - Easiest)
1. Go to [retell.ai](https://retell.ai) and sign up
2. Create a new agent
3. Use this prompt for your agent:
   ```
   You are a professional pharmacy assistant for [Your Pharmacy Name]. 
   You help patients with medication questions, refill requests, delivery scheduling, 
   and general pharmacy inquiries. Always be helpful, professional, and HIPAA compliant.
   ```
4. Get your API key and Agent ID from the dashboard

#### Option B: Vapi
1. Go to [vapi.ai](https://vapi.ai) and sign up
2. Create an assistant with pharmacy workflows
3. Get API key, Assistant ID, and Phone Number ID

#### Option C: Twilio
1. Go to [twilio.com](https://twilio.com) and sign up
2. Get a phone number
3. Get Account SID, Auth Token, and Phone Number

### Step 3: Email Setup (Resend)
1. Go to [resend.com](https://resend.com) and sign up
2. Get your API key from the dashboard
3. (Optional) Verify your domain

### Step 4: Create Environment File
Create a file called `.env.local` in your project root with:

```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Voice Provider (choose one)
VOICE_PROVIDER=retell
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_retell_agent_id

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_ENCRYPTION_KEY=your_32_character_encryption_key_here
VOICE_WEBHOOK_SECRET=your_webhook_secret_here
PHARMACIST_PHONE_NUMBER=+1234567890
```

### Step 5: Database Migration
Run this command to set up your database:
```bash
# You'll need to run the SQL migration in your Supabase dashboard
# Copy the contents of supabase/migrations/001_initial_schema.sql
# and run it in the SQL Editor in Supabase
```

## What to Send Me

Once you have the accounts set up, send me:

1. **Supabase credentials:**
   - Project URL
   - Anon key
   - Service role key

2. **Voice provider credentials:**
   - Which provider you chose (Retell/Vapi/Twilio)
   - API key
   - Agent/Assistant ID
   - Phone number (if applicable)

3. **Email credentials:**
   - Resend API key

4. **Your pharmacy details:**
   - Pharmacy name
   - Your phone number for testing

I'll help you create the `.env.local` file and test the system!

## Cost Estimate
- **Supabase**: Free (500MB database)
- **Retell**: ~$0.10-0.20 per minute
- **Resend**: Free (3,000 emails/month)
- **Total**: ~$0-50/month for testing

## Need Help?
Just let me know which step you're on and I'll guide you through it!
