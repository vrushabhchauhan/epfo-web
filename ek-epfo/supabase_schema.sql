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
    gender text check (gender in ('Male', 'Female', 'Other')),
    father_or_husband_name text,
    pan_masked text,
    aadhaar_masked text,
    bank_account_masked text,
    bank_ifsc text,
    bank_name text,
    bank_branch text,
    kyc_status text default 'Verified (Aadhaar + PAN + Bank)' check (kyc_status in ('Verified (Aadhaar + PAN + Bank)', 'Pending', 'Rejected')),
    total_service_years text default '9 Years 2 Months',
    current_office text default 'Regional Office Mumbai (Bandra)',
    active_uan_status text default 'Active' check (active_uan_status in ('Active', 'Inactive')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Establishments (Employers) Table
create table if not exists public.establishments (
    est_id text primary key,
    name text not null,
    est_code text not null,
    address text,
    compliance_score text default '100%',
    status text default 'Active' check (status in ('Active', 'Inactive')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Member Accounts (MIDs per establishment)
create table if not exists public.member_accounts (
    member_id text primary key,
    uan varchar(12) references public.members(uan) on delete cascade,
    est_name text not null,
    doj date not null,
    doe date,
    service_status text not null check (service_status in ('Active', 'Relieved')),
    transfer_status text check (transfer_status in ('Transferred via Form 13', 'Pending', 'None')),
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
    status text not null check (status in ('disbursed', 'in_progress', 'rejected')),
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
    status text not null check (status in ('pending_employer', 'pending_field_office', 'approved', 'rejected')),
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
    status text not null check (status in ('under_investigation', 'resolved', 'closed')),
    assigned_officer text not null,
    regional_office text not null,
    sla_days_target integer default 7,
    expected_resolution_date date not null,
    days_remaining integer default 4,
    appeal_allowed boolean default true
);
