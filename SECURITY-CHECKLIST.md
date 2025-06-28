# 🔐 Security Checklist for Developers

This checklist ensures the project maintains high security standards while enabling collaborative development.

## ✅ Environment Variables

- [ ] Never commit `.env`, `.env.local`, or `.env.production` files
- [ ] Use different API keys for development vs production
- [ ] Each developer has their own Supabase project for development
- [ ] Service role keys are only used in backend code (never frontend)
- [ ] Anon keys are properly scoped with RLS (Row Level Security)
- [ ] JWT secrets are long and random (minimum 32 characters)
- [ ] Production keys are rotated regularly

## ✅ Supabase Security

- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] Database policies are properly configured
- [ ] User authentication is properly implemented
- [ ] API keys have appropriate permissions (not full admin access)
- [ ] Database backups are configured for production

## ✅ Code Security

- [ ] No hardcoded secrets in code
- [ ] Input validation on all API endpoints
- [ ] Proper error handling (no sensitive data in error messages)
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented on API endpoints
- [ ] Dependencies are regularly updated and scanned for vulnerabilities

## ✅ Git Security

- [ ] `.env*` files are in `.gitignore`
- [ ] No secrets in commit history
- [ ] Branch protection rules are enabled on main/dev branches
- [ ] Code reviews are required for all changes
- [ ] Signed commits are used (optional but recommended)

## ✅ Deployment Security

- [ ] Production environment variables are set securely
- [ ] HTTPS is enforced in production
- [ ] Security headers are configured
- [ ] Monitoring and alerting are set up
- [ ] Database access is restricted to necessary IPs

## 🚨 If a Secret is Compromised

1. **Immediately rotate the compromised key**
2. **Check git history for any commits containing the secret**
3. **Update all environments with new keys**
4. **Notify the team**
5. **Review access logs for any suspicious activity**

## 🛠️ Security Tools

- **Environment validation**: `npm run env:test`
- **Dependency audit**: `npm audit`
- **Type checking**: `npm run type-check:all`
- **Linting**: `npm run lint:all`

## 📞 Security Questions?

If you have any security concerns or questions:
1. Ask the team lead
2. Review this checklist
3. Check the Supabase security documentation
4. When in doubt, use more restrictive permissions

---

**Remember: Security is everyone's responsibility!** 🛡️
