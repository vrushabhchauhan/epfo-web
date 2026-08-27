# Custom SMTP Email Delivery Setup (Brevo + Supabase)

This guide documents how to configure **Brevo (formerly Sendinblue)** as a custom SMTP provider for the **Ek-EPFO** Supabase backend. This replaces Supabase’s default free-tier rate limit (3–4 emails/hour) with Brevo’s free tier (**300 emails/day**), enabling real OTP delivery for users and hackathon judges.

---

## 1. Important Security Architecture Note
- **No SMTP Credentials in Code**: SMTP credentials (host, port, username, password) are **never** committed to this repository or placed in client `.env` files.
- **Hosted Supabase Configuration**: SMTP is handled entirely by Supabase's server-side Auth service and configured directly in the Supabase Dashboard.

---

## 2. Step-by-Step Brevo SMTP Configuration

### Step A: Create a Free Brevo Account
1. Visit **[https://www.brevo.com](https://www.brevo.com)** and sign up for a free account.
2. Complete the initial registration and verify your email address.

### Step B: Verify Your Sender Email
> [!IMPORTANT]
> Brevo will **not** send emails until you verify the sender address.
1. In the Brevo Dashboard, click your profile icon (top-right) &rarr; **Senders, Domains & Dedicated IPs**.
2. Under **Senders**, click **Add a Sender**.
3. Set:
   - **From Name**: `Ek-EPFO Member Services`
   - **From Email**: Enter your verified email (e.g. `vrushabhpchauhan53@gmail.com` or your custom domain email).
4. Check your inbox for the verification email from Brevo and click the verification link.

### Step C: Brevo SMTP Settings (Active Configuration)
- **SMTP Server (Host)**: `smtp-relay.brevo.com`
- **Port**: `2525` (Recommended over 587 for Supabase Cloud to avoid ISP filtering)
- **Login / Username**: `b6e071001@smtp-brevo.com`
- **Sender Email**: `vrushabhpchauhan53@gmail.com`
- **Sender Name**: `Ek-EPFO Member Services`
- **Daily Quota**: `300 emails/day` (Free Tier Active)

---

## 3. Live Automated Supabase Configuration Status

The project (`zeswhdxfovzmcdwqxmhz`) has been configured via Supabase Management API with:
- `smtp_host`: `smtp-relay.brevo.com`
- `smtp_port`: `2525`
- `rate_limit_email_sent`: `300 emails/hour`
- `smtp_sender_name`: `Ek-EPFO Member Services`
- `smtp_admin_email`: `vrushabhpchauhan53@gmail.com`
- Delivery Status: **Verified (200 OK — Direct Inbox Dispatch Active)**

---

## 4. Supabase Email Template Customization (OTP Display)

To ensure users receive clean 6-digit numerical OTPs matching the Ek-EPFO portal:

1. In Supabase Dashboard, navigate to **Authentication** &rarr; **Email Templates**.
2. Click **Magic Link / Confirmation**:
   - **Subject**: `Your Ek-EPFO Verification Code: {{ .Token }}`
   - **Body**:
     ```html
     <h2>Ek-EPFO National Member Portal</h2>
     <p>Your one-time 6-digit verification code is:</p>
     <h1 style="font-size: 32px; letter-spacing: 4px; color: #003366;">{{ .Token }}</h1>
     <p>This statutory code is valid for 10 minutes. Do not share this code with anyone.</p>
     <hr/>
     <small style="color: #64748b;">Employees' Provident Fund Organisation • CITES 2.01 Centralized Registry</small>
     ```
3. Under **Authentication** &rarr; **URL Configuration**:
   - Set **OTP Expiry** to `3600` seconds (1 hour) or `600` seconds (10 minutes).
4. Click **Save Changes**.

---

## 5. Free Tier Usage & Quota Summary

| Provider | Free Quota | Rate Limits | Upgrade Triggers |
| :--- | :--- | :--- | :--- |
| **Default Supabase** | ~3–4 emails/hour | Very strict test limit | Continuous demo usage |
| **Brevo Custom SMTP** | **300 emails/day** | No hourly throttle | >300 logins or registrations/day |

---

## 6. Verification Test
1. Go to **[https://epfo-web.vercel.app/login/email](https://epfo-web.vercel.app/login/email)**.
2. Enter your real email address.
3. Check your inbox — you will receive an email branded as **Ek-EPFO Member Services** containing the real 6-digit code delivered via Brevo relay.
4. Enter the code on the verification screen to instantly authenticate.
