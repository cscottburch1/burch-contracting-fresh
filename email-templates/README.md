# Burch Contracting Email Signatures for Thunderbird

This folder contains professional email signature templates for use with Thunderbird email client.

## Available Templates

### 1. **thunderbird-signature.html** (Full Version)
Professional signature with:
- Company logo/branding
- Contact information with icons
- Tagline and services
- "Get Free Estimate" call-to-action button
- Confidentiality disclaimer

### 2. **thunderbird-signature-simple.html** (Minimal Version)
Cleaner, more minimal signature with:
- Company name and tagline
- Essential contact information
- No buttons or extras

## How to Install in Thunderbird

### Method 1: Using Signature Switch Add-on (Recommended)
1. Install the "Signature Switch" add-on from Thunderbird Add-ons
2. Go to Tools → Add-ons → Signature Switch
3. Click "Add" to create a new signature
4. Open one of the HTML files in a text editor
5. Copy all the HTML code
6. Paste it into the signature editor
7. Save and set as default

### Method 2: Manual HTML Signature
1. Go to **Tools → Account Settings**
2. Select your email account
3. Check **"Use HTML"**
4. Open one of the HTML files in a web browser
5. Select all (Ctrl+A) and copy (Ctrl+C)
6. Paste into the signature box in Thunderbird
7. Click **OK**

### Method 3: Using External File
1. Save one of the HTML files to a permanent location (e.g., `C:\Users\YourName\Documents\signature.html`)
2. Go to **Tools → Account Settings**
3. Select your email account
4. Check **"Attach the signature from a file instead"**
5. Click **Choose** and select your HTML file
6. Click **OK**

## Customization Tips

### Change Colors
- Primary Blue: `#1e40af` or `#2563eb`
- Gray Text: `#374151` or `#6b7280`
- Light Gray: `#9ca3af` or `#e5e7eb`

### Update Contact Info
Edit these sections in the HTML:
- Phone: `(864) 724-4600`
- Email: `estimates@burchcontracting.com`
- Website: `burchcontracting.com`
- Address: `Simpsonville, SC 29681`

### Remove Elements
To remove any section (like the CTA button or disclaimer):
1. Find the `<tr>` tag containing that section
2. Delete the entire `<tr>...</tr>` block

## Testing
After installing, send yourself a test email to verify:
- ✅ All links work correctly
- ✅ Colors display properly
- ✅ Layout looks good on mobile devices
- ✅ No broken images or formatting

## Troubleshooting

**Signature looks broken:**
- Make sure "Use HTML" is checked in account settings
- Try copying again from the browser instead of text editor

**Links not clickable:**
- Thunderbird might strip some HTML. Use the Signature Switch add-on instead

**Signature too large:**
- Use the simple version
- Remove the CTA button or disclaimer sections

## Support
For questions about these templates, contact your web developer or refer to Thunderbird's official documentation.
