# 🏥 Pharmacy Voice Automation - Complete Setup Guide

This guide will walk you through setting up the Pharmacy Voice Automation application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/))
- **A code editor** (VS Code recommended)
- **Accounts for required services** (see Service Setup section)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd pharmacy-voice-automation

# Make setup script executable and run it
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Environment

Edit `.env.local` with your service credentials:

```bash
# Copy the template
cp env.example .env.local

# Edit with your credentials
nano .env.local  # or use your preferred editor
```

## 🔧 Service Setup

### Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and enter project details
   - Note down your project URL and anon key

2. **Configure Database**
   ```bash
   # Install Supabase CLI (if not already installed)
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Run migrations
   supabase db push
   ```

3. **Set up Row Level Security**
   - The migrations will automatically set up RLS policies
   - Test with a sample user to ensure isolation works

4. **Configure Authentication**
   - Go to Authentication > Settings in Supabase dashboard
   - Set up email templates if needed
   - Configure redirect URLs for your domain

### Voice Provider Setup

Choose one of the following voice providers:

#### Option A: Retell AI (Recommended)

1. **Sign up** at [retellai.com](https://retellai.com)
2. **Create an agent** with pharmacy-specific prompts
3. **Get API key** from dashboard
4. **Configure webhook** to point to your app

```env
VOICE_PROVIDER=retell
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_retell_agent_id
```

#### Option B: Vapi

1. **Sign up** at [vapi.ai](https://vapi.ai)
2. **Create assistant** with pharmacy workflows
3. **Get API key** and phone number ID
4. **Configure webhook** endpoint

```env
VOICE_PROVIDER=vapi
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
```

#### Option C: Twilio

1. **Sign up** at [twilio.com](https://twilio.com)
2. **Get phone number** for voice calls
3. **Create TwiML** for call handling
4. **Get Account SID and Auth Token**

```env
VOICE_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Email Service Setup (Resend)

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your domain** (recommended) or use default
3. **Get API key** from dashboard
4. **Configure sender email**

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

### Monitoring Setup (Sentry)

1. **Sign up** at [sentry.io](https://sentry.io)
2. **Create new project** (Next.js)
3. **Get DSN** from project settings
4. **Configure organization and project names**

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

## 🗄️ Database Setup

### 1. Run Migrations

```bash
# Push schema to Supabase
npm run db:push

# Or use Supabase CLI
supabase db push
```

### 2. Verify Setup

Check that these tables were created:
- `organizations`
- `users`
- `patients`
- `voice_calls`
- `call_logs`
- `email_notifications`

### 3. Create Test Data (Optional)

```sql
-- Insert test organization
INSERT INTO organizations (name, slug) VALUES ('Test Pharmacy', 'test-pharmacy');

-- Insert test user (you'll need to create this through Supabase Auth first)
-- Then link the user to the organization
```

## 🧪 Development

### 1. Start Development Server

```bash
npm run dev
```

### 2. Access Application

- **Frontend**: http://localhost:3000
- **Supabase Dashboard**: Your project dashboard URL

### 3. Test Features

1. **Authentication**: Create a user account
2. **Dashboard**: Verify stats load correctly
3. **Voice Calls**: Test call initiation (with test phone numbers)
4. **Email**: Check notification emails are sent

## 🚀 Deployment to Vercel

### 1. Prepare for Deployment

```bash
# Make Vercel setup script executable
chmod +x scripts/vercel-setup.sh
./scripts/vercel-setup.sh
```

### 2. Connect Repository

1. **Push code to GitHub/GitLab**
2. **Go to [vercel.com](https://vercel.com)**
3. **Import your repository**
4. **Select the project**

### 3. Configure Environment Variables

In Vercel dashboard, add these environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
APP_ENCRYPTION_KEY=your_32_character_encryption_key

# Voice Provider (choose one)
VOICE_PROVIDER=retell
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_retell_agent_id

# Email
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project

# Security
VOICE_WEBHOOK_SECRET=your_webhook_secret
PHARMACIST_PHONE_NUMBER=+1234567890
```

### 4. Deploy

```bash
# Deploy to production
vercel --prod

# Or use Vercel dashboard to trigger deployment
```

### 5. Post-Deployment Setup

1. **Update Supabase redirect URLs** to include your Vercel domain
2. **Update voice provider webhooks** to point to your production URL
3. **Test all functionality** in production environment

## 🔒 Security Configuration

### 1. Environment Variables

- **Never commit** `.env.local` to version control
- **Use strong encryption keys** (32+ characters)
- **Rotate API keys** regularly
- **Use different keys** for development and production

### 2. Supabase Security

- **Enable RLS** on all tables (done automatically)
- **Review RLS policies** for your use case
- **Set up proper user roles**
- **Configure CORS** for your domains

### 3. Voice Provider Security

- **Use webhook secrets** for verification
- **Validate all incoming webhooks**
- **Implement rate limiting**
- **Monitor for suspicious activity**

## 🧪 Testing

### 1. Unit Tests

```bash
# Run tests (when implemented)
npm test
```

### 2. Integration Tests

- **Test voice call flow** end-to-end
- **Verify email notifications** are sent
- **Check database isolation** between organizations
- **Test error handling** and recovery

### 3. Load Testing

- **Test concurrent calls**
- **Verify database performance**
- **Check API rate limits**
- **Monitor memory usage**

## 📊 Monitoring

### 1. Sentry Setup

- **Configure error tracking**
- **Set up performance monitoring**
- **Create alerts** for critical errors
- **Review compliance logs**

### 2. Application Monitoring

- **Monitor call success rates**
- **Track response times**
- **Watch database performance**
- **Monitor email delivery**

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check Supabase URL and keys
   - Verify RLS policies
   - Check network connectivity

2. **Voice Call Failures**
   - Verify API keys and configuration
   - Check webhook endpoints
   - Review call logs

3. **Email Not Sending**
   - Check Resend API key
   - Verify domain configuration
   - Check spam folders

4. **Authentication Issues**
   - Verify Supabase auth configuration
   - Check redirect URLs
   - Review user permissions

### Getting Help

- **Check logs** in Sentry dashboard
- **Review Supabase logs** in dashboard
- **Check Vercel function logs**
- **Contact support** for service-specific issues

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ✅ Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] Voice provider is configured and tested
- [ ] Email notifications are working
- [ ] Authentication is properly set up
- [ ] RLS policies are in place
- [ ] Monitoring is configured
- [ ] Error handling is tested
- [ ] Performance is acceptable
- [ ] Security measures are in place

---

**Need help?** Check the troubleshooting section or create an issue in the repository.