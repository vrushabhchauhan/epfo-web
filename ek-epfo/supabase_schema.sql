-- =========================================================================
-- CITES 2.01 PostgreSQL Database Schema for Project Ek-EPFO
-- Paste this script directly into Supabase SQL Editor (https://supabase.com)
-- =========================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Master Citizen Members Table
create table if not exists public.members (
    uan varchar(12) primary key,
    name text not null,
    email text unique,
    phone text,
    phone_masked text,
    dob date,
    gender text,
    father_or_husband_name text,
    pan_masked text,
    aadhaar_masked text,
    bank_account_masked text,
    bank_ifsc text,
    bank_name text,
    bank_branch text,
    kyc_status text default 'Verified (Aadhaar + PAN + Bank)',
    total_service_years text default '9 Years 2 Months',
    current_office text default 'Regional Office Mumbai (Bandra)',
    active_uan_status text default 'Active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Establishments (Employers) Table
create table if not exists public.establishments (
    est_id text primary key,
    name text not null,
    est_code text not null,
    address text,
    compliance_score text default '100%',
    status text default 'Active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Member Accounts (MIDs per establishment)
create table if not exists public.member_accounts (
    member_id text primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    est_name text not null,
    doj date not null,
    doe date,
    service_status text not null,
    transfer_status text,
    last_ecr_month text,
    last_deposit_date text,
    challan_trrn text
);

-- 5. ECR Monthly Contribution Ledger Table
create table if not exists public.ecr_ledgers (
    id uuid default uuid_generate_v4() primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    wage_month text not null,
    gross_wage numeric,
    epf_wage numeric,
    employee_share numeric not null,
    employer_share numeric not null,
    eps_share numeric not null,
    trrn text,
    deposit_date date not null
);

-- 6. Balances Table (3-Fund Statutory Split)
create table if not exists public.balances (
    uan varchar(12) primary key references public.members(uan) on delete cascade,
    total_accumulation numeric not null,
    employee_share_total numeric not null,
    employer_share_total numeric not null,
    eps_pension_fund_total numeric not null,
    interest_rate_annual text default '8.25%',
    interest_accrued_fy26 numeric default 18450,
    last_interest_credited_date date default '2026-03-31'
);

-- 7. Nominees Table
create table if not exists public.nominees (
    id uuid default uuid_generate_v4() primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    name text not null,
    relationship text not null,
    dob date,
    share_percent integer default 100,
    bank_account_masked text,
    bank_ifsc text,
    edli_coverage_limit numeric default 700000
);

-- 8. Statutory Claims Table
create table if not exists public.claims (
    claim_id text primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    form_number text not null,
    claim_type text not null,
    amount_requested numeric not null,
    amount_disbursed numeric,
    tds_deducted numeric default 0,
    filed_date date not null,
    settled_date date,
    status text not null, -- 'disbursed', 'in_progress', 'rejected'
    current_stage integer default 1,
    rejection_reason_code text,
    rejection_summary text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. PF Account Transfers (Form 13) Table
create table if not exists public.transfers (
    transfer_id text primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    form_number text default 'Form 13',
    from_establishment text not null,
    from_member_id text not null,
    to_establishment text not null,
    to_member_id text not null,
    initiated_date date not null,
    estimated_amount numeric not null,
    status text not null,
    current_step integer default 2,
    days_waiting integer default 12,
    auto_escalation_due_days integer default 2
);

-- 10. Grievances Table (EPFiGMS / CPGRAMS)
create table if not exists public.grievances (
    grievance_id text primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    linked_claim_id text,
    category text not null,
    filed_date date not null,
    status text not null,
    assigned_officer text not null,
    regional_office text not null,
    sla_days_target integer default 7,
    expected_resolution_date date not null,
    days_remaining integer default 4,
    appeal_allowed boolean default true
);

-- =========================================================================
-- SEED INITIAL CITES 2.01 DEMO DATA
-- =========================================================================

-- Insert Member
insert into public.members (uan, name, email, phone, phone_masked, dob, gender, father_or_husband_name, pan_masked, aadhaar_masked, bank_account_masked, bank_ifsc, bank_name, bank_branch)
values ('1004829371', 'Ananya Rao', 'ananya.demo@example.com', '9876544821', '••••••4821', '1990-04-12', 'Female', 'Mukesh K. Rao', '•••••482K', '•••• •••• 9281', '•••• •••• 4821', 'SBIN0001234', 'State Bank of India', 'Bandra West, Mumbai')
on conflict (uan) do nothing;

-- Insert Establishments
insert into public.establishments (est_id, name, est_code, address, compliance_score)
values 
('EST-MH-BAN-0018293', 'Sundar Textiles Pvt Ltd', 'MH/BAN/0018293/000', 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093', '96%'),
('EST-MH-BAN-0049281', 'Coral Systems Ltd', 'MH/BAN/0049281/000', 'Tower 3, Nesco IT Park, Goregaon East, Mumbai 400063', '100%')
on conflict (est_id) do nothing;

-- Insert Member Accounts
insert into public.member_accounts (member_id, uan, est_name, doj, doe, service_status, transfer_status, last_ecr_month, last_deposit_date, challan_trrn)
values 
('MH/BAN/0018293/000/0048291', '1004829371', 'Sundar Textiles Pvt Ltd', '2015-06-01', '2019-03-31', 'Relieved', 'Transferred via Form 13', '2019-03', '2019-04-15', 'TRRN-102938491'),
('MH/BAN/0049281/000/0091823', '1004829371', 'Coral Systems Ltd', '2019-04-01', null, 'Active', null, '2026-07', '2026-08-14', 'TRRN-8492019284')
on conflict (member_id) do nothing;

-- Insert Balances
insert into public.balances (uan, total_accumulation, employee_share_total, employer_share_total, eps_pension_fund_total)
values ('1004829371', 493600, 214300, 186500, 92800)
on conflict (uan) do nothing;

-- Insert Nominee
insert into public.nominees (uan, name, relationship, dob, share_percent, bank_account_masked, bank_ifsc, edli_coverage_limit)
values ('1004829371', 'Priya Rao', 'Spouse', '1992-08-20', 100, '•••• •••• 4821', 'SBIN0001234', 700000);

-- Insert Claims
insert into public.claims (claim_id, uan, form_number, claim_type, amount_requested, amount_disbursed, filed_date, settled_date, status, current_stage)
values 
('CLM1042', '1004829371', 'Form 31', 'Partial Advance (Medical)', 45000, 45000, '2026-06-02', '2026-06-14', 'disbursed', 4),
('CLM1078', '1004829371', 'Form 31', 'Education Advance', 30000, null, '2026-08-10', null, 'in_progress', 2),
('CLM1091', '1004829371', 'Form 31', 'Medical Advance (> ₹50,000)', 60000, null, '2026-08-15', null, 'rejected', 2)
on conflict (claim_id) do nothing;

-- Insert Transfers
insert into public.transfers (transfer_id, uan, from_establishment, from_member_id, to_establishment, to_member_id, initiated_date, estimated_amount, status, current_step, days_waiting)
values ('TRF-9021', '1004829371', 'Sundar Textiles Pvt Ltd', 'MH/BAN/0018293/000/0048291', 'Coral Systems Ltd', 'MH/BAN/0049281/000/0091823', '2026-08-04', 142800, 'pending_employer', 2, 12)
on conflict (transfer_id) do nothing;

-- Insert Grievances
insert into public.grievances (grievance_id, uan, linked_claim_id, category, filed_date, status, assigned_officer, regional_office, expected_resolution_date, days_remaining)
values ('GRV-849201', '1004829371', 'CLM1091', 'Claim Processing Delay & Form 15G Verification', '2026-08-19', 'under_investigation', 'Rajesh Verma (Assistant PF Commissioner)', 'Regional Office Mumbai (Bandra)', '2026-08-26', 4)
on conflict (grievance_id) do nothing;

-- Enable Row Level Security (RLS) & Public Read Access for Demo
alter table public.members enable row level security;
alter table public.establishments enable row level security;
alter table public.member_accounts enable row level security;
alter table public.ecr_ledgers enable row level security;
alter table public.balances enable row level security;
alter table public.nominees enable row level security;
alter table public.claims enable row level security;
alter table public.transfers enable row level security;
alter table public.grievances enable row level security;

create policy "Public Read All" on public.members for select using (true);
create policy "Public Read Establishments" on public.establishments for select using (true);
create policy "Public Read Accounts" on public.member_accounts for select using (true);
create policy "Public Read Ledgers" on public.ecr_ledgers for select using (true);
create policy "Public Read Balances" on public.balances for select using (true);
create policy "Public Read Nominees" on public.nominees for select using (true);
create policy "Public Read Claims" on public.claims for select using (true);
create policy "Public Read Transfers" on public.transfers for select using (true);
create policy "Public Read Grievances" on public.grievances for select using (true);
