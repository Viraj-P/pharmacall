# Local SEO Audit Tool 🚀

A comprehensive local SEO analysis tool built with Next.js, Supabase, and Tailwind CSS. Analyze your business website's SEO performance, technical setup, local signals, and content quality.

## ✨ Features

- **🔍 Real-time SEO Analysis** - Crawl and analyze websites instantly
- **📊 Comprehensive Scoring** - 5-category scoring system (SEO, Technical, Local, Performance, Content)
- **🎯 Local SEO Focus** - Specialized analysis for local business optimization
- **📱 Responsive Dashboard** - Beautiful, mobile-friendly interface
- **⚡ Fast Performance** - Built with Next.js 15 and Turbopack
- **🗄️ Data Persistence** - Store and track audit results over time

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file:
```env
# Required: Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: PageSpeed Insights API
PAGESPEED_API_KEY=your_pagespeed_api_key

# Optional: Email Service
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database
- Create a [Supabase](https://supabase.com) project
- Run the SQL commands from `database.sql` in your Supabase SQL editor
- Copy your project credentials to `.env.local`

### 4. Launch Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to `http://localhost:3000`

## 🧪 How to Use

1. **Start an Audit**
   - Go to `/new` page
   - Enter business name and website URL
   - Submit to begin analysis

2. **View Results**
   - Real-time scoring across 5 categories
   - Detailed issue identification
   - Actionable improvement recommendations

3. **Track Progress**
   - Dashboard shows all audits
   - Historical performance tracking
   - Score comparisons over time

## 🏗️ Architecture

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL with Row Level Security
- **Analysis**: Custom SEO algorithms + PageSpeed Insights integration
- **Deployment**: Vercel/Netlify ready

## 📊 Analysis Categories

### SEO Score (On-page)
- Title tag optimization
- Meta description quality
- Heading structure (H1, H2, H3)
- Image alt text validation

### Technical Score
- HTTPS implementation
- Robots.txt presence
- Sitemap.xml availability
- Mobile viewport configuration
- Favicon setup

### Local Score
- Address information detection
- Phone number validation
- Business hours identification
- Local business signals

### Content Score
- Word count analysis
- Heading structure quality
- Image optimization
- Content depth assessment

### Performance Score
- Basic performance metrics
- PageSpeed Insights integration (with API key)
- Core Web Vitals analysis

## 🔑 API Keys Required

| Service | Purpose | Cost | Required |
|---------|---------|------|----------|
| **Supabase** | Database & Auth | Free tier | ✅ Yes |
| **PageSpeed Insights** | Performance Analysis | Free (10k/day) | ❌ No |
| **Resend** | Email Notifications | Free tier | ❌ No |

## 🚀 Production Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Set production URLs:**
   - Update `NEXT_PUBLIC_APP_URL` to your domain
   - Ensure all API keys are configured

## 🐛 Troubleshooting

### Common Issues
- **Database Connection**: Verify Supabase credentials
- **Audit Failures**: Check website accessibility
- **Missing Scores**: Ensure database tables exist

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test with simple websites first
4. Check Supabase dashboard for table creation

## 📈 Roadmap

- [ ] PDF report generation
- [ ] Email notifications
- [ ] Competitor analysis
- [ ] Schema.org validation
- [ ] Historical trend analysis
- [ ] API rate limiting
- [ ] Bulk audit processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check the [SETUP.md](./SETUP.md) for detailed setup instructions
- Review browser console for error messages
- Test with simple websites first
- Ensure all environment variables are set

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
