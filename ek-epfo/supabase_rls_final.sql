-- =========================================================================
-- CANONICAL RLS POLICIES FOR EK-EPFO (supabase_rls_final.sql)
-- NOTE: This file is the single canonical source of truth for Row Level Security.
-- It supersedes and replaces supabase_rls_fix.sql and supabase_migration_v2_security.sql.
-- Do NOT re-run the previous migration scripts.
-- =========================================================================

-- 1. Performance & Foreign Key Indexes
create index if not exists idx_members_email on public.members(email);
create index if not exists idx_member_accounts_uan on public.member_accounts(uan);
create index if not exists idx_ecr_ledgers_uan on public.ecr_ledgers(uan);
create index if not exists idx_nominees_uan on public.nominees(uan);
create index if not exists idx_claims_uan on public.claims(uan);
create index if not exists idx_transfers_uan on public.transfers(uan);
create index if not exists idx_grievances_uan on public.grievances(uan);

-- 2. Enable Row Level Security (RLS)
alter table public.members enable row level security;
alter table public.establishments enable row level security;
alter table public.member_accounts enable row level security;
alter table public.ecr_ledgers enable row level security;
alter table public.balances enable row level security;
alter table public.nominees enable row level security;
alter table public.claims enable row level security;
alter table public.transfers enable row level security;
alter table public.grievances enable row level security;

-- 3. Drop all previous/legacy policies to avoid conflicts
drop policy if exists "Public Read All" on public.members;
drop policy if exists "Allow read all members" on public.members;
drop policy if exists "Allow insert/update members" on public.members;
drop policy if exists "Member Read Own Profile" on public.members;
drop policy if exists "Member Upsert Profile" on public.members;

drop policy if exists "Public Read Establishments" on public.establishments;

drop policy if exists "Public Read Balances" on public.balances;
drop policy if exists "Allow read all balances" on public.balances;
drop policy if exists "Allow insert/update balances" on public.balances;
drop policy if exists "Member Read Balances" on public.balances;
drop policy if exists "Member Upsert Balances" on public.balances;

drop policy if exists "Public Read Accounts" on public.member_accounts;
drop policy if exists "Member Read Accounts" on public.member_accounts;

drop policy if exists "Public Read Ledgers" on public.ecr_ledgers;
drop policy if exists "Member Read Ledgers" on public.ecr_ledgers;

drop policy if exists "Public Read Nominees" on public.nominees;
drop policy if exists "Member Read Nominees" on public.nominees;

drop policy if exists "Public Read Claims" on public.claims;
drop policy if exists "Allow manage claims" on public.claims;
drop policy if exists "Member Manage Claims" on public.claims;

drop policy if exists "Public Read Transfers" on public.transfers;
drop policy if exists "Allow manage transfers" on public.transfers;
drop policy if exists "Member Manage Transfers" on public.transfers;

drop policy if exists "Public Read Grievances" on public.grievances;
drop policy if exists "Allow manage grievances" on public.grievances;
drop policy if exists "Member Manage Grievances" on public.grievances;

-- 4. Public Read on Non-Sensitive Reference Tables
create policy "Public Read Establishments" on public.establishments
    for select using (true);

-- 5. Identity-Scoped Policies (JWT email match or service_role ONLY - zero anon bypass)

-- Members
create policy "Member Read Own Profile" on public.members
    for select using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

create policy "Member Upsert Profile" on public.members
    for all using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    ) with check (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Balances
create policy "Member Read Balances" on public.balances
    for select using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

create policy "Member Upsert Balances" on public.balances
    for all using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    ) with check (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Member Accounts
create policy "Member Read Accounts" on public.member_accounts
    for select using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- ECR Contribution Ledgers
create policy "Member Read Ledgers" on public.ecr_ledgers
    for select using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Nominees
create policy "Member Read Nominees" on public.nominees
    for select using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Claims
create policy "Member Manage Claims" on public.claims
    for all using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    ) with check (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Transfers (Form 13)
create policy "Member Manage Transfers" on public.transfers
    for all using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    ) with check (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Grievances (EPFiGMS)
create policy "Member Manage Grievances" on public.grievances
    for all using (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    ) with check (
        uan in (select uan from public.members where email = auth.jwt() ->> 'email')
        or auth.role() = 'service_role'
    );

-- Support Tickets
alter table public.support_tickets enable row level security;

drop policy if exists "Support Tickets Insert" on public.support_tickets;

create policy "Support Tickets Insert" on public.support_tickets
    for insert with check (true);
