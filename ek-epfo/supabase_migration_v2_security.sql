-- Migration V2: Security, Performance Indexes & Identity-Scoped RLS
-- Run in Supabase SQL Editor

-- 1. Performance & Foreign Key Indexes
create index if not exists idx_members_email on public.members(email);
create index if not exists idx_member_accounts_uan on public.member_accounts(uan);
create index if not exists idx_ecr_ledgers_uan on public.ecr_ledgers(uan);
create index if not exists idx_nominees_uan on public.nominees(uan);
create index if not exists idx_claims_uan on public.claims(uan);
create index if not exists idx_transfers_uan on public.transfers(uan);
create index if not exists idx_grievances_uan on public.grievances(uan);

-- 2. Drop legacy public policies
drop policy if exists "Public Read All" on public.members;
drop policy if exists "Public Read Establishments" on public.establishments;
drop policy if exists "Public Read Accounts" on public.member_accounts;
drop policy if exists "Public Read Ledgers" on public.ecr_ledgers;
drop policy if exists "Public Read Balances" on public.balances;
drop policy if exists "Public Read Nominees" on public.nominees;
drop policy if exists "Public Read Claims" on public.claims;
drop policy if exists "Public Read Transfers" on public.transfers;
drop policy if exists "Public Read Grievances" on public.grievances;

-- 3. Identity RLS Policies
create policy "Public Read Establishments" on public.establishments for select using (true);

create policy "Member Read Own Profile" on public.members
    for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Upsert Profile" on public.members
    for all using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Read Balances" on public.balances
    for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Upsert Balances" on public.balances
    for all using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Read Accounts" on public.member_accounts
    for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Read Ledgers" on public.ecr_ledgers
    for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Read Nominees" on public.nominees
    for select using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Manage Claims" on public.claims
    for all using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Manage Transfers" on public.transfers
    for all using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');

create policy "Member Manage Grievances" on public.grievances
    for all using (uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role' or auth.role() = 'anon');
