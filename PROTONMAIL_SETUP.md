# ProtonMail SMTP Setup for GUARDIANCHAIN

## Current Status
✅ Complete email notification system implemented  
✅ 8 notification types ready (AI memory, capsule events, DAO votes, weekly reports, etc.)  
✅ Markdown-powered beautiful email templates with GUARDIANCHAIN branding  
✅ User preference management and opt-in/opt-out system  
✅ Admin notification hub with system health monitoring  
✅ Email tracking and analytics infrastructure  
❌ ProtonMail SMTP credentials needed for live email sending  

## What We Built (From Your Attached ProtonMail File)

### Core Email System
- `server/lib/mailer.ts` - Enhanced ProtonMail transporter with markdown rendering
- `server/notifications/` - 8 notification modules for all email types
- `client/src/pages/Notifications.tsx` - Professional notification center UI
- `server/routes/notifications.ts` - Complete API for email management

### Advanced Features
- **Markdown Templates**: Beautiful HTML emails from markdown source
- **User Preferences**: Granular opt-in/opt-out controls
- **Admin Alerts**: System health, user actions, critical notifications
- **Email Tracking**: Built-in analytics and engagement monitoring
- **Force Send**: Critical alerts bypass user preferences
- **Mock System**: Simulates emails when SMTP not configured (current state)

## Required ProtonMail Configuration

You need to provide these 4 environment variables:

```bash
SMTP_HOST=smtp.protonmail.ch
SMTP_PORT=587
SMTP_USER=commander.guardian@protonmail.com
SMTP_PASS=your_protonmail_app_password
```

## How to Get ProtonMail App Password

1. **Log into ProtonMail**: Go to protonmail.com and sign in
2. **Settings**: Click Settings gear icon → Go to Security
3. **App Passwords**: Look for "App passwords" or "Generate password for third-party apps"
4. **Generate**: Create new app password for "SMTP/Email client"
5. **Save**: Copy the generated password - this becomes your `SMTP_PASS`

## Testing the System

Currently the notification center at `/notifications` shows:
- ✅ API endpoints working (200 responses)
- ✅ User preferences loading
- ✅ Test email functions simulating sends
- ❌ Actual email sending waiting for SMTP credentials

## Once SMTP is Configured

All 8 notification types will work:
1. **AI Memory Saves** - When your Sovereign AI stores important conversations
2. **Capsule Events** - Remix, seal, and replay notifications
3. **DAO Governance** - Vote confirmations and proposal updates  
4. **Weekly Digests** - GTT yield reports and performance summaries
5. **Legacy Protocol** - Digital inheritance and executor settings
6. **Monthly Reports** - Achievement summaries and platform statistics
7. **Admin Alerts** - System health and critical notifications
8. **Preference Changes** - Opt-in/out confirmations

## Email Templates Preview

All emails use beautiful GUARDIANCHAIN branding:
- Purple-to-green gradient backgrounds
- Professional typography
- Structured markdown content
- Tracking pixels for analytics
- Consistent brand messaging

The system is production-ready and waiting only for your ProtonMail credentials.