# 🏥 Pharmacy Voice Automation

AI-powered voice call automation platform for specialty pharmacies with HIPAA compliance and multi-tenant architecture.

## ✨ Features

- **🤖 AI Voice Agents** - Integration with Retell, Vapi, and Twilio
- **🔐 HIPAA Compliant** - End-to-end PHI encryption and audit trails
- **🏢 Multi-tenant** - Secure organization isolation with RLS
- **📊 Real-time Analytics** - Comprehensive dashboard and reporting
- **📧 Email Automation** - Resend integration for follow-ups
- **🔍 Monitoring** - Sentry error tracking and performance monitoring
- **🎨 Modern UI** - Beautiful interface with Tailwind CSS and Radix UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Voice provider account (Retell, Vapi, or Twilio)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pharmacy-voice-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Voice Provider (choose one)
   VOICE_PROVIDER=retell # or vapi, twilio
   RETELL_API_KEY=your_retell_api_key
   RETELL_AGENT_ID=your_retell_agent_id
   
   # Email Configuration
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   APP_ENCRYPTION_KEY=your_32_character_encryption_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration: `supabase/migrations/001_initial_schema.sql`
   - Enable Row Level Security (RLS) policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Supabase Migration

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the migration**:
   ```sql
   -- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
   -- into your Supabase SQL editor and execute
   ```

3. **Set up encryption key**:
   ```sql
   -- Set your encryption key (replace with your actual key)
   ALTER SYSTEM SET app.encryption_key = 'your_32_character_encryption_key';
   ```

### Database Schema

The application uses the following main tables:

- **`organizations`** - Multi-tenant pharmacy organizations
- **`users`** - Pharmacists and admins with role-based access
- **`patients`** - PHI-encrypted patient records
- **`voice_calls`** - Call records with transcripts and structured data
- **`call_logs`** - Audit trail for compliance
- **`email_notifications`** - Email tracking and delivery status

## 🔧 Voice Provider Setup

### Retell AI
1. Sign up at [retellai.com](https://retellai.com)
2. Create an agent for pharmacy calls
3. Get your API key and agent ID
4. Configure webhook URL: `https://your-domain.com/api/voice/webhook`

### Vapi
1. Sign up at [vapi.ai](https://vapi.ai)
2. Create an assistant for pharmacy calls
3. Get your API key and assistant ID
4. Configure webhook URL: `https://your-domain.com/api/voice/webhook`

### Twilio
1. Sign up at [twilio.com](https://twilio.com)
2. Get your account SID, auth token, and phone number
3. Configure webhook URL: `https://your-domain.com/api/voice/webhook`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📱 Usage

### For Pharmacists

1. **Login** to the dashboard
2. **View analytics** - Call statistics and success rates
3. **Initiate calls** - Use quick actions for common call types
4. **Review transcripts** - Access call recordings and AI insights
5. **Manage patients** - View patient profiles and call history

### Call Types

- **Delivery Scheduling** - Automated delivery coordination
- **Medication Changes** - Handle prescription modifications
- **Shipment Feedback** - Collect delivery feedback
- **General Inquiry** - Answer patient questions

## 🔒 Security & Compliance

### HIPAA Compliance
- **PHI Encryption** - All patient data encrypted at rest and in transit
- **Audit Trails** - Comprehensive logging of all system activities
- **Access Controls** - Role-based permissions and multi-tenant isolation
- **Data Retention** - Configurable retention policies

### Security Features
- **Row Level Security (RLS)** - Database-level access control
- **Webhook Verification** - Secure webhook signature validation
- **Environment Isolation** - Separate configurations per environment
- **Error Monitoring** - Sentry integration for security monitoring

## 🛠️ Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   ├── (auth)/            # Authentication pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries
│   ├── supabase/         # Database client
│   ├── voice-agents/     # Voice provider integrations
│   └── auth.ts           # Authentication utilities
└── types/                # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### API Endpoints

- `POST /api/voice/initiate` - Start a voice call
- `POST /api/voice/webhook` - Handle call events
- `GET /api/dashboard/stats` - Get analytics data
- `GET /api/calls` - List calls
- `POST /api/calls` - Create new call
- `POST /api/email/process` - Send notifications

## 📊 Monitoring

### Sentry Integration
- Error tracking and performance monitoring
- HIPAA-compliant logging (no PHI in logs)
- Real-time alerts for critical issues

### Analytics
- Call success rates and duration metrics
- Patient engagement statistics
- Voice agent performance insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Security**: Report security issues privately to security@yourdomain.com

## 🎯 Roadmap

- [ ] Advanced AI conversation analytics
- [ ] Multi-language support
- [ ] Mobile app for pharmacists
- [ ] Integration with more pharmacy management systems
- [ ] Advanced reporting and business intelligence
- [ ] Voice biometric authentication

---

Built with ❤️ for specialty pharmacies