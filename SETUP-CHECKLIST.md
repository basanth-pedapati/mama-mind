# 🎯 Mama Mind Setup Checklist

Use this checklist to ensure your database and external services are properly configured.

## ✅ Database Setup

### Supabase Project
- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new project named "mama-mind"
- [ ] Saved database password securely
- [ ] Copied Project URL and API keys

### Environment Configuration
- [ ] Ran `npm run setup` to configure environment variables
- [ ] Verified `.env.local` has Supabase credentials
- [ ] Verified `server/.env` has backend configuration

### Database Schema
- [ ] Opened Supabase SQL Editor
- [ ] Copied and ran entire `database/schema.sql` file
- [ ] Verified all tables were created (users, vitals, alerts, etc.)
- [ ] Confirmed Row Level Security (RLS) is enabled

### Authentication Setup
- [ ] Configured Site URL: `http://localhost:3000`
- [ ] Added Redirect URL: `http://localhost:3000/auth/callback`
- [ ] Enabled email authentication
- [ ] (Optional) Configured social auth providers

### Database Testing
- [ ] Ran `npm run db:test` successfully
- [ ] All tables accessible and RLS working
- [ ] Authentication system responding

## 🔧 External Services (Optional)

### OpenAI (for AI Chat)
- [ ] Created OpenAI account
- [ ] Generated API key
- [ ] Added `OPENAI_API_KEY` to `server/.env`
- [ ] Set `ENABLE_AI_CHAT=true`

### Twilio (for SMS Alerts)
- [ ] Created Twilio account
- [ ] Got Account SID and Auth Token
- [ ] Purchased phone number
- [ ] Added credentials to `server/.env`
- [ ] Set `ENABLE_SMS_ALERTS=true`

### SendGrid (for Email Notifications)
- [ ] Created SendGrid account
- [ ] Generated API key
- [ ] Verified sender identity
- [ ] Added credentials to `server/.env`
- [ ] Set `ENABLE_EMAIL_NOTIFICATIONS=true`

### Redis (for Caching)
- [ ] Installed Redis locally or signed up for Redis Cloud
- [ ] Added `REDIS_URL` to `server/.env`
- [ ] Tested connection

## 🚀 Application Testing

### Frontend
- [ ] Ran `npm install` successfully
- [ ] Started with `npm run dev`
- [ ] Accessible at `http://localhost:3000`
- [ ] Landing page loads correctly
- [ ] Authentication pages work

### Backend
- [ ] Ran `npm install` in server directory
- [ ] Started with `npm run dev`
- [ ] Accessible at `http://localhost:3001`
- [ ] Health check returns 200: `curl http://localhost:3001/health`
- [ ] API routes respond correctly

### End-to-End Testing
- [ ] Can register new user account
- [ ] Can login with created account
- [ ] Dashboard loads with user data
- [ ] Can create vitals record
- [ ] Alerts system working
- [ ] (If enabled) AI chat responds

## 📊 Sample Data (Optional)

### Development Data
- [ ] Created test user through authentication
- [ ] Noted user ID from Supabase Auth
- [ ] Updated `database/sample-data.sql` with real user ID
- [ ] Ran sample data script in Supabase SQL Editor
- [ ] Verified data appears in dashboard

## 🔒 Security Verification

### Database Security
- [ ] RLS enabled on all tables
- [ ] Policies restrict data access by user
- [ ] Service role key kept secure
- [ ] Database password is strong

### Application Security
- [ ] JWT secret is random and secure
- [ ] HTTPS configured for production
- [ ] Environment variables not committed to git
- [ ] API rate limiting enabled

## 🐛 Troubleshooting

### Common Issues
- [ ] **Port conflicts**: Make sure 3000 and 3001 are available
- [ ] **Environment variables**: Check spelling and formatting
- [ ] **Database connection**: Verify Supabase credentials
- [ ] **RLS errors**: Ensure proper user authentication
- [ ] **CORS issues**: Check backend CORS configuration

### Debug Commands
- [ ] `npm run db:test` - Test database connection
- [ ] `curl http://localhost:3001/health` - Test backend
- [ ] Check browser console for frontend errors
- [ ] Check terminal logs for detailed error messages

## 🎉 Deployment Ready

### Pre-deployment Checklist
- [ ] All features working locally
- [ ] Environment variables configured for production
- [ ] Database migrations ready
- [ ] External services configured
- [ ] Security settings reviewed
- [ ] Performance testing completed

### Production Environment
- [ ] Frontend deployed (Vercel, Netlify, etc.)
- [ ] Backend deployed (Railway, Heroku, etc.)
- [ ] Production database configured
- [ ] Domain and SSL configured
- [ ] Monitoring and logging setup

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the logs**: Frontend (browser console) and backend (terminal)
2. **Review documentation**: `QUICKSTART.md`, `database/SETUP.md`
3. **Test components**: Use individual test scripts
4. **Verify environment**: Double-check all environment variables
5. **Start fresh**: Sometimes a clean install resolves issues

## 🏆 Success!

Once all items are checked, you have:
- ✅ A fully functional maternity care platform
- ✅ Secure authentication and data protection
- ✅ Real-time vitals tracking
- ✅ AI-powered assistance
- ✅ Beautiful, responsive UI
- ✅ Scalable architecture ready for production

Happy coding! 🚀
