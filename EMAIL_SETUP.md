# Custom Email Delivery Setup (Resend REST API + Supabase)

This guide documents how **Resend REST API** is configured as the email delivery provider for the **Ek-EPFO** portal. This powers instant 6-digit OTP verification email delivery for member login, UAN activation, and account recovery without third-party SMTP throttling.

---

## 1. Architecture & Security Overview

- **Direct REST API Integration**: Email dispatch is executed via Resend's REST API endpoint (`POST https://api.resend.com/emails`).
- **Secure Key Management**: The Resend API Key is loaded from environment variables (`VITE_RESEND_API_KEY`) across client environments (`.env`, `.env.qa`, and `ek-epfo/.env`).
- **Database Backed Verification**: 6-digit numeric OTP codes are securely generated, stored in the Supabase `otp_codes` database table with a strict 10-minute expiration timestamp (`expires_at`), and invalidated upon single use (`used: true`).
- **Zero SMTP Dependency**: Direct OTP verification runs over HTTPS REST API calls, avoiding SMTP socket timeouts and port blocking.

---

## 2. Resend API Configuration

### Step A: API Key Provisioning
1. Sign in to **[https://resend.com](https://resend.com)**.
2. Under **API Keys**, create a new restricted sending API key or full-access key.
3. Configure the key in the application environment files:
   ```env
   VITE_RESEND_API_KEY=re_************************************
   ```

### Step B: Sender Address Configuration
- **Testing / Onboarding Domain**: `onboarding@resend.dev` (allows sending directly to the verified account owner email e.g. `vrushabhpchauhan53@gmail.com`).
- **Production Custom Domain**: Verify your custom domain (e.g. `mail.ekepfo.gov.in` or custom apex domain) at [resend.com/domains](https://resend.com/domains) and update the `from` sender header.

---

## 3. Email Dispatch Payload Format

Direct OTP emails are dispatched using the following JSON payload:

```json
{
  "from": "onboarding@resend.dev",
  "to": ["user@example.com"],
  "subject": "Your 6-Digit Ek-EPFO Verification Code: 123456",
  "html": "<p>Your 6-digit verification code is: <strong>123456</strong>.</p><p>This code expires in 10 minutes.</p>"
}
```

### HTTP Headers:
- `Authorization`: `Bearer <VITE_RESEND_API_KEY>`
- `Content-Type`: `application/json`

---

## 4. Quota & Rate Limit Summary

| Provider / Tier | Monthly Quota | Daily Limit | Rate Throttling | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Resend Free Tier** | **3,000 emails/month** | **100 emails/day** | High throughput REST | Demo, QA, and Production OTP delivery |
| **Default Supabase Auth** | ~100 emails/month | Strict hourly burst | 3–4 emails/hour | Basic dev fallbacks |

---

## 5. Verification Test & Flow

1. Go to **[https://epfo-web.vercel.app/login/email](https://epfo-web.vercel.app/login/email)** or the local development server.
2. Enter your email address (`vrushabhpchauhan53@gmail.com`).
3. Click **Get Verification Code**.
4. Check your inbox — you will receive an email from `onboarding@resend.dev` with subject **"Your 6-Digit Ek-EPFO Verification Code: [CODE]"**.
5. Enter the 6-digit code on the verification screen to authenticate immediately.
