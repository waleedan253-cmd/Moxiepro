# MoxiePro Backend Setup Guide

Complete setup instructions for the MoxiePro backend API and integrations.

## Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment and KV database)
- Anthropic API key (Claude)
- Lemon Squeezy account (payments)
- Resend account (transactional emails)
- SendFox account (marketing emails - optional)

## Step 1: Install Dependencies

```bash
cd MoxiePro
npm install
```

This installs:
- `@anthropic-ai/sdk` - Claude AI for audit generation
- `@vercel/kv` - Redis database for data storage
- `@vercel/blob` - PDF storage
- `puppeteer` - Psychology Today profile scraping
- `@react-pdf/renderer` - PDF generation
- `resend` - Email sending
- `axios` - HTTP requests

## Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then fill in the values:

### Anthropic Claude API

1. Go to https://console.anthropic.com/
2. Create an API key
3. Add $5-10 credits to your account
4. Copy the key to `.env`:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
```

### Vercel KV Database

1. Go to https://vercel.com/dashboard
2. Create a new project or select existing
3. Go to Storage tab
4. Create a new KV Database (Redis)
5. Copy the environment variables to `.env`:

```
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=xxx...
KV_REST_API_READ_ONLY_TOKEN=xxx...
```

### Lemon Squeezy Payment Processor

1. Go to https://www.lemonsqueezy.com/
2. Create an account (works in Pakistan!)
3. Create a Store
4. Create a Product:
   - Name: "Psychology Today Profile Audit - Full PDF"
   - Price: $14.99 USD
   - Digital product
5. Go to Settings → API
6. Create API key
7. Copy Store ID, Product ID, and API Key to `.env`:

```
LEMON_SQUEEZY_API_KEY=xxx...
LEMON_SQUEEZY_STORE_ID=12345
LEMON_SQUEEZY_PRODUCT_ID=67890
```

8. Set up webhook (after deploying):
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.vercel.app/api/webhook`
   - Select events: `order_created`, `subscription_payment_success`
   - Copy webhook secret to `.env`:

```
LEMON_SQUEEZY_WEBHOOK_SECRET=xxx...
```

### Resend Email Service

1. Go to https://resend.com/
2. Create account (3,000 emails/month free)
3. Add and verify your domain (or use their test domain)
4. Create API key
5. Copy to `.env`:

```
RESEND_API_KEY=re_xxx...
```

### SendFox Email Marketing (Optional)

1. Go to https://sendfox.com/
2. Create account (lifetime free plan available)
3. Create a List for your subscribers
4. Go to Settings → API
5. Create Personal Access Token
6. Copy to `.env`:

```
SENDFOX_API_KEY=xxx...
SENDFOX_LIST_ID=123456
```

### Vercel Blob Storage (for PDFs)

1. In Vercel Dashboard → Storage
2. Create Blob Store
3. Copy token to `.env`:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx...
```

### App URLs

```
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
NODE_ENV=development
```

## Step 3: Test Locally

### Test API Endpoints

1. Start the development server:

```bash
npm run dev
```

2. Test scraping endpoint:

```bash
curl -X POST http://localhost:5173/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"profileUrl": "https://www.psychologytoday.com/us/therapists/..."}'
```

3. Test full audit creation:

```bash
curl -X POST http://localhost:5173/api/create-audit \
  -H "Content-Type: application/json" \
  -d '{
    "profileUrl": "https://www.psychologytoday.com/us/therapists/...",
    "userEmail": "test@example.com"
  }'
```

4. Test getting audit:

```bash
curl http://localhost:5173/api/get-audit?id=audit_xxx
```

## Step 4: Deploy to Vercel

### Initial Deployment

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No (first time)
- Project name? moxie-pro
- Directory? ./
- Override settings? No

4. Set production environment variables:

```bash
vercel env add ANTHROPIC_API_KEY production
vercel env add KV_URL production
vercel env add KV_REST_API_URL production
vercel env add KV_REST_API_TOKEN production
# ... add all environment variables
```

Or use Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from `.env`

5. Deploy to production:

```bash
vercel --prod
```

### Continuous Deployment

Push to GitHub and Vercel will auto-deploy:

```bash
git add .
git commit -m "Backend setup complete"
git push origin main
```

## Step 5: Configure Webhooks

After deployment, update webhook URLs:

### Lemon Squeezy Webhook

1. Go to Lemon Squeezy Dashboard → Settings → Webhooks
2. Update webhook URL to: `https://your-domain.vercel.app/api/webhook`
3. Test webhook with their test tool

## Step 6: Test Production

1. Visit your deployed site: `https://your-domain.vercel.app`
2. Try creating an audit with a real Psychology Today profile
3. Check Vercel logs for any errors:

```bash
vercel logs
```

4. Monitor Claude API usage: https://console.anthropic.com/
5. Check Lemon Squeezy test mode works

## API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/create-audit` | POST | Main endpoint - scrapes profile and generates audit |
| `/api/get-audit` | GET | Retrieves audit by ID |
| `/api/create-payment` | POST | Creates Lemon Squeezy checkout session |
| `/api/webhook` | POST | Handles payment webhooks from Lemon Squeezy |
| `/api/generate-pdf` | POST | Generates PDF for paid audit |
| `/api/send-email` | POST | Sends transactional emails |

## Cost Breakdown

### Setup Costs (One-time)
- Anthropic API credits: $5-10
- Domain (optional): $12/year
- **Total: $5-22**

### Monthly Costs (100 audits/month)
- Claude API: ~$12 (100 audits × $0.12)
- Vercel: Free (up to 1000 audits/month)
- Vercel KV: Free (up to 3,000 commands/day)
- Vercel Blob: ~$0.15 (100 PDFs × 1MB)
- Resend: Free (3,000 emails/month)
- SendFox: Free (lifetime)
- **Total: ~$12/month**

### Revenue (100 audits, 30% conversion)
- Free audits: 70 × $0 = $0
- Paid PDFs: 30 × $14.99 = $449.70
- Lemon Squeezy fees: 30 × ($0.50 + 5%) = $37.49
- **Net Revenue: $412.21**
- **Profit: $400/month**

## Troubleshooting

### Puppeteer Issues on Vercel

If scraping fails, check:
1. Memory allocation in `vercel.json` (should be 3008 MB for create-audit)
2. Timeout settings (60 seconds max)
3. Use `headless: 'new'` mode

### Claude API Errors

- Check API key is valid
- Ensure you have credits
- Check request/output token limits
- Monitor rate limits (4000 requests/min)

### Database Connection Issues

- Verify KV environment variables are correct
- Check KV database is in same region as deployment
- Test connection with `vercel kv get test-key`

### Payment Webhook Not Working

- Verify webhook secret matches
- Check webhook URL is correct (no trailing slash)
- Test with Lemon Squeezy webhook tester
- Check Vercel function logs

### Email Not Sending

- Verify Resend API key
- Check domain is verified
- Test with their API testing tool
- Check from address is authorized

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] Webhook signatures are verified
- [ ] Rate limiting is enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] CORS is properly configured

## Next Steps

After setup is complete:
1. ✅ Test all API endpoints
2. ✅ Create test audit with real profile
3. ✅ Test payment flow in Lemon Squeezy test mode
4. ✅ Set up email templates
5. ✅ Configure Google Analytics
6. ✅ Add legal pages (Terms, Privacy, Refund)
7. ✅ Test on mobile devices
8. 🚀 Launch to beta users!

## Support

For issues or questions:
- Check NOTES.md for detailed implementation plan
- Review Vercel logs: `vercel logs --follow`
- Check Claude API dashboard for usage
- Test webhooks with RequestBin or webhook.site

## Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Anthropic Console**: https://console.anthropic.com/
- **Lemon Squeezy**: https://app.lemonsqueezy.com/
- **Resend Dashboard**: https://resend.com/emails
- **SendFox Dashboard**: https://sendfox.com/dashboard
- **Project Documentation**: See NOTES.md for full roadmap

---

**Ready to launch?** Follow the 4-week implementation plan in NOTES.md!
