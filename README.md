# Pharmacy Voice Automation

AI-powered voice call automation tool for specialty pharmacies. This application enables pharmacists to trigger automated voice calls for delivery scheduling, medication changes, and shipment feedback while maintaining PHI compliance.

## Features

- **Multi-tenant Architecture**: Secure organization-based data isolation
- **Voice Agent Integration**: Support for Retell, Vapi, and Twilio
- **PHI Compliance**: Encrypted data storage and HIPAA-compliant logging
- **Real-time Dashboard**: Call monitoring and patient management
- **Email Notifications**: Automated follow-ups and summaries
- **Audit Trail**: Comprehensive logging for compliance

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Voice**: Retell AI, Vapi, or Twilio
- **Email**: Resend
- **Monitoring**: Sentry
- **Styling**: Tailwind CSS with Radix UI components

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your services:

```bash
cp env.example .env.local
```

Fill in your service credentials in `.env.local`.

### 2. Database Setup

Run the Supabase migrations:

```bash
npm run db:push
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Configuration

### Voice Providers

The application supports three voice providers:

#### Retell AI
```env
VOICE_PROVIDER=retell
RETELL_API_KEY=your_api_key
RETELL_AGENT_ID=your_agent_id
```

#### Vapi
```env
VOICE_PROVIDER=vapi
VAPI_API_KEY=your_api_key
VAPI_ASSISTANT_ID=your_assistant_id
VAPI_PHONE_NUMBER_ID=your_phone_number_id
```

#### Twilio
```env
VOICE_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
```

### Email Configuration

Configure Resend for email notifications:

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

### Monitoring

Set up Sentry for error tracking:

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

## Architecture

### Database Schema

The application uses a multi-tenant architecture with Row Level Security (RLS):

- **Organizations**: Top-level tenant isolation
- **Users**: Pharmacists with role-based access
- **Patients**: PHI-compliant patient data with encryption
- **Voice Calls**: Call records with transcripts and structured data
- **Call Logs**: Audit trail for compliance
- **Email Notifications**: Notification tracking

### Security Features

- **PHI Encryption**: Patient data encrypted at rest
- **RLS Policies**: Database-level access control
- **Webhook Verification**: Secure voice provider integration
- **Compliance Logging**: HIPAA-compliant audit trails
- **Data Sanitization**: PHI filtering in error logs

### API Routes

- `/api/calls` - Call management
- `/api/patients` - Patient management
- `/api/voice/webhook` - Voice provider webhooks
- `/api/voice/initiate` - Call initiation
- `/api/email/process` - Email notification processing
- `/api/dashboard/stats` - Dashboard statistics

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Environment Variables

Ensure all required environment variables are set in your deployment environment.

### Database

Run migrations in your Supabase project:

```bash
npm run db:push
```

## Usage

### For Pharmacists

1. **Login**: Access the dashboard with your credentials
2. **Initiate Calls**: Use the quick actions to start voice calls
3. **Monitor Progress**: View real-time call status and transcripts
4. **Review Results**: Access structured data and AI insights

### For Administrators

1. **User Management**: Manage pharmacist accounts and permissions
2. **Organization Settings**: Configure voice providers and preferences
3. **Compliance Monitoring**: Review audit logs and access patterns

## Compliance

This application is designed with healthcare compliance in mind:

- **HIPAA Compliance**: PHI encryption and access controls
- **Audit Trails**: Comprehensive logging of all actions
- **Data Minimization**: Only necessary data is collected and stored
- **Access Controls**: Role-based permissions and RLS policies

## Support

For technical support or questions about compliance, please contact your system administrator.

## License

This software is proprietary and confidential. Unauthorized distribution is prohibited.