# Demo Credentials for Evaluators

These accounts are pre-seeded with sample data (passbook history, past claims, a resolved grievance) so you can explore the portal without registering a new account first.

## Demo Account 1 (Active Workforce Member with Rich History)
- **Name**: Ananya Rao
- **UAN**: `1004829371`
- **Email**: `ananya.demo@example.com`
- **Password**: `DemoPass@2026`
- **Pre-seeded Data**:
  - Accumulated PF Balance: ₹4,93,600 (₹2,48,200 Employee Share, ₹1,62,400 Employer Share)
  - 12-Month ECR Contribution Ledger (Coral Systems Ltd)
  - 3 Historical Statutory Claims (Form 31 Medical, Form 19 Settlement, Form 31 Housing Advance)
  - 1 EPFiGMS Grievance (Transfer ledger delay inquiry)

## Demo Account 2 (Cloud Verified Member)
- **Name**: Vrushabh Chauhan
- **UAN**: `101492810392`
- **Email**: `vrushabhpchauhan53@gmail.com`
- **Password**: `Vrushabh@2026`
- **Pre-seeded Data**:
  - Direct UAN Allotment Verified Status
  - Live Supabase Cloud PostgreSQL Record (`public.members` & `public.balances`)

---

## Experiencing New Member Self-Registration

To experience the full end-to-end registration flow as a new member with clean, fresh data:
1. Navigate to **/uan/allot** (Direct UAN Allotment) or **/uan/activate** (UAN Activation).
2. Enter your own details (Name, Date of Birth, Mobile, Email).
3. Validate using the dynamic 6-digit OTP code generated on screen.
4. Set your custom password (minimum 8 characters).
5. A collision-free, unique 12-digit national UAN will be generated.
6. Log in to your personal member dashboard showing your own name, a fresh zero-balance passbook, and zero pre-existing claims.
