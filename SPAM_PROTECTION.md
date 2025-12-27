# Spam Protection Setup Instructions

## Overview
Comprehensive spam protection has been implemented with:
- ✅ **reCAPTCHA v3** (invisible protection)
- ✅ **Rate Limiting** (IP-based throttling)
- ✅ **Honeypot Fields** (bot detection)

## Protected Endpoints
1. **Contact Form** (`/api/contact`) - 5 requests per 15 minutes
2. **Portal Registration** (`/api/portal/register`) - 3 registrations per hour  
3. **Admin Login** (`/api/admin/login`) - 5 attempts per 15 minutes

## reCAPTCHA v3 Setup

### Step 1: Get Google reCAPTCHA Keys
1. Go to: https://www.google.com/recaptcha/admin/create
2. Select **reCAPTCHA v3** (most important!)
3. Add your domains:
   - Production: `burchcontracting.com`
   - Development: `localhost`
4. Accept terms and submit
5. Copy both keys:
   - **Site Key** (starts with `6L...`)
   - **Secret Key** (starts with `6L...`)

### Step 2: Add to Local Environment
Create or update `.env.local`:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Step 3: Add to Production Server
SSH into your server and add to `.env.local`:
```bash
ssh root@72.60.166.68
cd /var/www/burch-contracting
nano .env.local
```

Add these lines:
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

Save (Ctrl+O, Enter, Ctrl+X)

### Step 4: Deploy Code
```bash
# From your local machine
ssh root@72.60.166.68 "cd /var/www/burch-contracting && git pull origin main && npm run build && ~/.nvm/versions/node/v24.11.1/bin/pm2 restart burch-site"
```

## How It Works

### reCAPTCHA v3 (Invisible)
- Runs automatically on form submission
- Scores user behavior (0.0 = bot, 1.0 = human)
- Minimum acceptable score: 0.5
- No CAPTCHA challenges for users
- Blocks suspicious submissions

### Rate Limiting
- Tracks requests by IP address
- Cloudflare IP headers supported (`cf-connecting-ip`)
- In-memory storage (resets on restart)
- Different limits per endpoint:
  - Contact form: 5 per 15 min
  - Registration: 3 per hour
  - Admin login: 5 per 15 min

### Honeypot Fields
- Hidden fields that humans don't see
- Bots auto-fill all fields (including hidden ones)
- If honeypot is filled = instant rejection
- Zero user friction

## Testing

### Test Contact Form
1. Go to: https://burchcontracting.com/contact
2. Fill out form normally
3. Submit - should work fine
4. Try submitting 6 times rapidly - 6th should fail

### Test Honeypot
1. Open browser dev tools
2. In console, type:
```javascript
document.querySelector('input[name="website"]').style.display = 'block';
```
3. Fill the revealed "website" field
4. Submit - should be rejected

### Verify reCAPTCHA
1. Open browser dev tools → Network tab
2. Submit contact form
3. Look for request to `google.com/recaptcha/api/siteverify`
4. Check response has `success: true` and `score` > 0.5

## Monitoring

### Check Logs
```bash
ssh root@72.60.166.68
~/.nvm/versions/node/v24.11.1/bin/pm2 logs burch-site --lines 50
```

Look for:
- `Spam detected (honeypot)` - Bot caught
- `Rate limit exceeded` - Too many requests
- `reCAPTCHA validation failed` - Low score
- `Low reCAPTCHA score: X.XX` - Suspicious but not blocked

### Adjust Settings
If you're getting too many false positives:
- Lower minimum reCAPTCHA score (currently 0.5)
- Increase rate limits
- Edit: `src/lib/recaptcha.ts` and API routes

## Cloudflare Integration
Your site already benefits from Cloudflare's DDoS protection.  
This adds an additional application-level security layer.

### Cloudflare Settings (Recommended)
1. Enable "Bot Fight Mode" (Free plan)
2. Enable "Challenge Passage" = 30 minutes
3. Security Level: Medium or High
4. Browser Integrity Check: ON

## Backup Protection
Even if reCAPTCHA fails to load:
- ✅ Rate limiting still works
- ✅ Honeypot still works
- ✅ Basic validation still works

The site degrades gracefully without breaking.

## Support
If you encounter issues:
1. Check PM2 logs for errors
2. Verify reCAPTCHA keys are correct
3. Test with browser dev tools open
4. Check for 400/429 error responses
