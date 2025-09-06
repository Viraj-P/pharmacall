# 🚀 Deployment Guide

This guide will help you deploy the Pharmacy Voice Automation platform to production.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account (free tier available)
- [ ] Supabase account
- [ ] Voice provider account (Retell, Vapi, or Twilio)
- [ ] Resend account (for email notifications)
- [ ] Domain name (optional, Vercel provides free subdomain)

## 🗄️ Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `pharmacy-voice-automation`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### 1.2 Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration
6. Verify tables were created in **Table Editor**

### 1.3 Configure Encryption Key

1. In SQL Editor, run:
   ```sql
   ALTER SYSTEM SET app.encryption_key = 'your_32_character_encryption_key_here';
   ```
   Replace with a secure 32-character key

2. Restart your Supabase project for the setting to take effect

### 1.4 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (for `SUPABASE_SERVICE_ROLE_KEY`)

## 🤖 Step 2: Voice Provider Setup

Choose one of the following voice providers:

### Option A: Retell AI (Recommended)

1. Sign up at [retellai.com](https://retellai.com)
2. Create a new agent:
   - **Name**: "Pharmacy Voice Agent"
   - **Voice**: Choose appropriate voice
   - **Language**: English
   - **Purpose**: Patient communication for pharmacy
3. Configure the agent with pharmacy-specific prompts
4. Get your **API Key** and **Agent ID**
5. Set webhook URL: `https://your-domain.vercel.app/api/voice/webhook`

### Option B: Vapi

1. Sign up at [vapi.ai](https://vapi.ai)
2. Create an assistant for pharmacy calls
3. Get your **API Key** and **Assistant ID**
4. Configure webhook URL: `https://your-domain.vercel.app/api/voice/webhook`

### Option C: Twilio

1. Sign up at [twilio.com](https://twilio.com)
2. Get your **Account SID**, **Auth Token**, and **Phone Number**
3. Configure webhook URL: `https://your-domain.vercel.app/api/voice/webhook`

## 📧 Step 3: Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Get your **API Key**
4. Set up email templates for:
   - Call completion notifications
   - Daily summaries
   - Error alerts

## 🐙 Step 4: GitHub Setup

### 4.1 Create Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it: `pharmacy-voice-automation`
3. Make it private (recommended for healthcare data)
4. Don't initialize with README (we already have one)

### 4.2 Push Code

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: Pharmacy Voice Automation platform"
git branch -M main
git remote add origin https://github.com/yourusername/pharmacy-voice-automation.git
git push -u origin main
```

## 🚀 Step 5: Vercel Deployment

### 5.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

### 5.2 Set Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

#### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
APP_ENCRYPTION_KEY=your_32_character_encryption_key
VOICE_WEBHOOK_SECRET=your_webhook_secret
PHARMACIST_PHONE_NUMBER=+1234567890
```

#### Voice Provider Variables (choose one)

**For Retell:**
```
VOICE_PROVIDER=retell
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_retell_agent_id
```

**For Vapi:**
```
VOICE_PROVIDER=vapi
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
```

**For Twilio:**
```
VOICE_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

#### Optional Variables
```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
EMAIL_FROM=noreply@yourdomain.com
```

### 5.3 Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Your app will be available at `https://your-project.vercel.app`

## 🔧 Step 6: Post-Deployment Configuration

### 6.1 Update Webhook URLs

1. Go to your voice provider dashboard
2. Update webhook URL to: `https://your-domain.vercel.app/api/voice/webhook`
3. Test webhook connectivity

### 6.2 Create First Organization

1. Access your deployed app
2. Go to `/auth/login`
3. Create a test account
4. In Supabase dashboard, manually create an organization:
   ```sql
   INSERT INTO organizations (name, slug) 
   VALUES ('Test Pharmacy', 'test-pharmacy');
   ```
5. Update the user's organization_id in the users table

### 6.3 Test the Application

1. **Login** - Verify authentication works
2. **Dashboard** - Check if stats load (may be empty initially)
3. **Voice Calls** - Test call initiation (will fail without real voice provider setup)
4. **API Endpoints** - Verify all endpoints respond correctly

## 🔒 Step 7: Security Hardening

### 7.1 Domain Security

1. **Custom Domain** (optional):
   - Add your domain in Vercel dashboard
   - Configure DNS records
   - Enable HTTPS (automatic with Vercel)

2. **Environment Security**:
   - Use strong, unique encryption keys
   - Rotate API keys regularly
   - Monitor access logs

### 7.2 Database Security

1. **Enable RLS** (already done in migration)
2. **Review Policies** - Ensure proper access controls
3. **Backup Strategy** - Set up automated backups in Supabase
4. **Monitoring** - Enable Supabase monitoring and alerts

## 📊 Step 8: Monitoring Setup

### 8.1 Sentry (Optional)

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project for Next.js
3. Get your DSN
4. Add to Vercel environment variables
5. Configure alerts for errors

### 8.2 Analytics

1. **Supabase Analytics** - Monitor database performance
2. **Vercel Analytics** - Track app performance
3. **Custom Metrics** - Monitor call success rates

## 🧪 Step 9: Testing

### 9.1 Functional Testing

- [ ] User authentication and authorization
- [ ] Dashboard loads and displays data
- [ ] Voice call initiation (with test provider)
- [ ] Email notifications
- [ ] API endpoints respond correctly
- [ ] Database queries work
- [ ] Error handling

### 9.2 Security Testing

- [ ] PHI data is encrypted
- [ ] RLS policies work correctly
- [ ] API endpoints are protected
- [ ] Webhook signatures are verified
- [ ] No sensitive data in logs

## 🎉 Step 10: Go Live

### 10.1 Final Checklist

- [ ] All environment variables configured
- [ ] Database migration completed
- [ ] Voice provider webhooks configured
- [ ] Email templates set up
- [ ] Monitoring configured
- [ ] Security measures in place
- [ ] Testing completed
- [ ] Documentation updated

### 10.2 Launch

1. **Announce** to your team
2. **Train** pharmacists on the new system
3. **Monitor** closely for the first few days
4. **Gather feedback** and iterate

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**
- Check environment variables are set correctly
- Verify all dependencies are in package.json
- Check for TypeScript errors

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies
- Ensure migration was run successfully

**Voice Provider Issues:**
- Verify API keys are correct
- Check webhook URL is accessible
- Test with provider's test endpoints

**Email Issues:**
- Verify Resend API key
- Check domain verification
- Test with simple email first

### Getting Help

- Check the main README.md for detailed documentation
- Review inline code comments
- Open GitHub issues for bugs
- Contact support for urgent issues

---

🎉 **Congratulations!** Your Pharmacy Voice Automation platform is now live and ready to help specialty pharmacies improve patient communication!
