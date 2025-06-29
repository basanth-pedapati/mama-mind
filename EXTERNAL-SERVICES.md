# 🔌 External Services Configuration Guide

This guide covers setting up all external services needed for the Mama Mind application.

## 📋 Services Overview

### Required Services
- ✅ **Supabase** - Database & Authentication (Already configured)
- 🔑 **OpenAI API** - AI Chat & Recommendations  
- 📱 **Twilio** - SMS Notifications & Alerts
- 📧 **SendGrid/Resend** - Email Services
- 📊 **Sentry** - Error Monitoring (Optional)
- 📈 **Google Analytics** - Usage Analytics (Optional)

### Optional Services
- 🗄️ **Redis** - Caching & Session Management
- 🖼️ **Cloudinary** - Image Processing
- 📅 **Google Calendar API** - Appointment Scheduling
- 🏥 **Healthcare APIs** - Medical Data Integration

---

## 🤖 OpenAI API Setup

### 1. Create OpenAI Account
1. **Visit [platform.openai.com](https://platform.openai.com)**
2. **Sign up or log in**
3. **Add payment method** (required for API access)
4. **Go to API Keys section**

### 2. Generate API Key
1. **Click "Create new secret key"**
2. **Name**: `mama-mind-development`
3. **Copy the key** (starts with `sk-...`)
4. **Save it securely** - you won't see it again!

### 3. Set Usage Limits (Recommended)
1. **Go to Billing > Usage limits**
2. **Set monthly limit**: $10-20 for development
3. **Set email alerts** at 50% and 80%

### 4. Configure in Environment
```bash
# Add to server/.env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini  # Cost-effective for development
OPENAI_MAX_TOKENS=1000
```

---

## 📱 Twilio Setup (SMS Notifications)

### 1. Create Twilio Account
1. **Visit [twilio.com](https://twilio.com)**
2. **Sign up for free trial** ($15 credit)
3. **Verify your phone number**
4. **Complete account setup**

### 2. Get Credentials
1. **Go to Console Dashboard**
2. **Copy Account SID**
3. **Copy Auth Token** (click to reveal)
4. **Get a phone number** (Develop > Phone Numbers > Manage > Buy a number)

### 3. Configure Environment
```bash
# Add to server/.env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number
```

---

## 📧 Email Service Setup (Resend - Recommended)

### 1. Create Resend Account
1. **Visit [resend.com](https://resend.com)**
2. **Sign up with email**
3. **Verify your email**
4. **Free tier**: 3,000 emails/month

### 2. Add Domain (Optional for development)
1. **Go to Domains**
2. **Add your domain** or use onboarding@resend.dev for testing
3. **Verify DNS records** (if using custom domain)

### 3. Generate API Key
1. **Go to API Keys**
2. **Create API key**
3. **Name**: `mama-mind-dev`
4. **Copy the key**

### 4. Configure Environment
```bash
# Add to server/.env
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com  # or onboarding@resend.dev
```

---

## 📊 Error Monitoring (Sentry - Optional)

### 1. Create Sentry Account
1. **Visit [sentry.io](https://sentry.io)**
2. **Sign up for free**
3. **Create new project**: React + Node.js
4. **Skip onboarding** for now

### 2. Get DSN
1. **Go to Settings > Projects > Your Project**
2. **Client Keys (DSN)**
3. **Copy the DSN URL**

### 3. Configure Environment
```bash
# Add to .env.local (frontend)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Add to server/.env (backend)
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

---

## 📈 Google Analytics (Optional)

### 1. Create Google Analytics Account
1. **Visit [analytics.google.com](https://analytics.google.com)**
2. **Sign in with Google account**
3. **Create Account** → **Create Property**
4. **Property name**: Mama Mind Development
5. **Configure data stream** for web

### 2. Get Measurement ID
1. **Go to Admin > Data Streams**
2. **Click your web stream**
3. **Copy Measurement ID** (starts with G-)

### 3. Configure Environment
```bash
# Add to .env.local (frontend)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🗄️ Redis Setup (Optional - For Production)

### Development (Local)
```bash
# Install Redis locally
# Windows: Download from https://redis.io/download
# Mac: brew install redis
# Linux: sudo apt-get install redis-server

# Add to server/.env
REDIS_URL=redis://localhost:6379
```

### Production (Redis Cloud)
1. **Visit [redis.com](https://redis.com)**
2. **Create free account**
3. **Create database**
4. **Get connection URL**

---

## ⚙️ Complete Environment Configuration

### Frontend (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Development
NODE_ENV=development
```

### Backend (server/.env)
```bash
# Server
NODE_ENV=development
PORT=3001
HOST=localhost

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security
JWT_SECRET=your_long_random_jwt_secret_32_plus_characters

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=1000

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Email
RESEND_API_KEY=re_your_resend_key
FROM_EMAIL=noreply@yourdomain.com

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## ✅ Validation & Testing

### 1. Update Environment Templates
```bash
# Run this to update .env.example files
npm run env:update-examples
```

### 2. Test All Services
```bash
# Validate all environment variables
npm run env:test

# Test external service connections
npm run services:test
```

### 3. Service-Specific Tests
```bash
# Test OpenAI connection
npm run test:openai

# Test Twilio SMS
npm run test:twilio

# Test email service
npm run test:email
```

---

## 💰 Cost Estimates (Development)

| Service | Free Tier | Development Cost |
|---------|-----------|------------------|
| Supabase | 500MB, 50k users | $0 |
| OpenAI | None | $5-10/month |
| Twilio | $15 trial credit | ~$5/month |
| Resend | 3k emails/month | $0 |
| Sentry | 5k errors/month | $0 |
| Google Analytics | Unlimited | $0 |
| Redis Cloud | 30MB | $0 |
| **Total** | | **~$10-15/month** |

---

## 🔒 Security Best Practices

### API Key Management
- ✅ Use different keys for dev/staging/production
- ✅ Set usage limits on all services
- ✅ Never commit API keys to git
- ✅ Rotate keys regularly in production
- ✅ Use environment-specific restrictions where possible

### Service Configuration
- ✅ Enable email alerts for usage/billing
- ✅ Use least-privilege access (minimal permissions)
- ✅ Enable two-factor authentication on all accounts
- ✅ Monitor service logs for unusual activity

---

## 🚀 Next Steps

After completing external services setup:

1. **Test all integrations** with the validation scripts
2. **Update team documentation** with service-specific guides
3. **Set up monitoring** and alerting for production
4. **Create service-specific error handling** in the application
5. **Implement feature flags** for gradual service rollouts

---

## 🆘 Troubleshooting

### Common Issues
- **OpenAI "Invalid API key"**: Check key format and billing setup
- **Twilio "Forbidden"**: Verify phone number and account status
- **Email delivery issues**: Check domain verification and spam settings
- **Rate limiting**: Monitor usage dashboards and adjust limits

### Getting Help
- Check service-specific documentation
- Review error logs and monitoring dashboards
- Test individual services before full integration
- Ask team lead for production service access if needed
