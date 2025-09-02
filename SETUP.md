# Local SEO Audit Tool - Setup Guide

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   # Supabase Configuration (Required for database)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # PageSpeed Insights API (Optional - for performance analysis)
   PAGESPEED_API_KEY=your_pagespeed_api_key_here

   # Email Service (Optional - for notifications)
   RESEND_API_KEY=your_resend_api_key_here

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up Supabase database:**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy your project URL and anon key to `.env.local`
   - Run the SQL commands from `database.sql` in your Supabase SQL editor

4. **Launch the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔑 Required API Keys

### Supabase (Required)
- **Purpose**: Database and authentication
- **Get it**: [supabase.com](https://supabase.com)
- **Cost**: Free tier available

### PageSpeed Insights (Optional)
- **Purpose**: Performance analysis and Core Web Vitals
- **Get it**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Cost**: Free (10,000 requests/day)

### Resend (Optional)
- **Purpose**: Email notifications
- **Get it**: [resend.com](https://resend.com)
- **Cost**: Free tier available

## 🗄️ Database Setup

1. **Create tables:**
   Run the SQL commands from `database.sql` in your Supabase SQL editor

2. **Enable Row Level Security (RLS):**
   The SQL script automatically sets up RLS policies

3. **Test connection:**
   The app will automatically test the database connection

## 🧪 Testing the Tool

1. **Create a new audit:**
   - Go to `/new` page
   - Enter a business name and website URL
   - Submit the form

2. **View results:**
   - The tool will analyze the website in real-time
   - View detailed scores and issues
   - Check the dashboard for overview

3. **Sample websites to test:**
   - `https://example.com` (basic test)
   - `https://google.com` (well-optimized)
   - Any local business website

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check if database tables exist
- Ensure RLS policies are enabled

### Audit Failures
- Check browser console for errors
- Verify website URLs are accessible
- Some websites may block automated requests

### Performance Issues
- PageSpeed Insights requires valid API key
- Some analyses may take time for large websites

## 🚀 Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify:**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Set production environment:**
   - Update `NEXT_PUBLIC_APP_URL` to your domain
   - Ensure all API keys are set

## 📊 Features Implemented

✅ **Core SEO Analysis**
- Title tag analysis
- Meta description checking
- Heading structure review
- Image alt text validation

✅ **Technical SEO**
- HTTPS verification
- Robots.txt checking
- Sitemap validation
- Mobile viewport analysis

✅ **Local SEO Signals**
- Address information detection
- Phone number validation
- Business hours checking

✅ **Content Quality**
- Word count analysis
- Heading structure
- Image optimization

✅ **Performance Analysis**
- Basic performance scoring
- PageSpeed Insights integration ready

✅ **User Interface**
- Responsive dashboard
- Detailed audit reports
- Score visualization
- Issue tracking

## 🔮 Future Enhancements

- PDF report generation
- Email notifications
- Historical tracking
- Competitor analysis
- Local business directory integration
- Schema.org markup validation

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure database tables are created
4. Test with simple websites first

The tool is designed to work even without all API keys - it will provide basic analysis and fallback scores.
