# Original User Request

## 2026-08-27T10:48:23Z

This is a single self-contained fix; keep it small and focused.
Diagnose and permanently resolve the Email OTP authentication flow in the Ek-EPFO project (React + Vite + Supabase + Brevo Custom SMTP) so that entering an email address dispatches a real OTP to the user's inbox without triggering false "Cloud Email Quota Reached" fallbacks, and ensures the verification step accepts both real and fallback codes seamlessly.

Working directory: `c:\Users\Vrushabh\Downloads\EPFO Web`
Integrity mode: development

## Requirements

### R1. Real Email OTP Dispatch via Supabase + Brevo
- Ensure `sendEmailOtp(email)` invokes `supabase.auth.signInWithOtp` for any valid email address.
- Verify that Supabase Auth custom SMTP configuration (`smtp-relay.brevo.com:2525`) successfully dispatches emails to real recipient inboxes without returning 429 rate limit or unexpected 500 errors.
- Ensure only synthetic/unroutable demo emails (e.g. `@member.epfo.gov.in`, `@example.com`) activate the simulated demo banner.

### R2. UI State & Banner Integrity
- Remove false positive triggers for the yellow quota warning badge on `/login/verify`.
- Display a clean confirmation banner when real OTP is dispatched (`Real OTP dispatched to your Inbox`).
- Ensure the 6-digit OTP input boxes auto-advance focus on entry and properly verify the submitted code.

## Acceptance Criteria

### Delivery & Verification
- [ ] Submitting a real email address on `/login/email` sends a real email to the user's inbox via Brevo SMTP relay with HTTP 200.
- [ ] Entering the 6-digit OTP received in the email logs the user into `/dashboard` with an active Supabase session.
- [ ] No false "Cloud Email Quota Reached" warning appears unless a genuine API 429 rate limit is returned by Supabase.
- [ ] `npm run lint` and `npm run build` pass with 0 errors and 0 warnings.
- [ ] Changes are built, tested, and deployed to `epfo-web.vercel.app`.
