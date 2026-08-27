-- Drop insecure public-read policies
drop policy if exists "Allow read members" on public.members;
drop policy if exists "Allow read balances" on public.balances;
drop policy if exists "Allow read claims" on public.claims;
drop policy if exists "Allow read nominees" on public.nominees;
drop policy if exists "Allow read grievances" on public.grievances;
drop policy if exists "Allow read ecr_ledgers" on public.ecr_ledgers;
drop policy if exists "Allow read transfers" on public.transfers;
drop policy if exists "Allow read member_accounts" on public.member_accounts;

-- Identity-scoped read policies
create policy "Members read own" on public.members for select using (
  email = auth.jwt() ->> 'email' or auth.role() = 'service_role'
);
create policy "Balances read own" on public.balances for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);
create policy "Claims read own" on public.claims for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);
create policy "Nominees read own" on public.nominees for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);
create policy "Grievances read own" on public.grievances for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);
create policy "ECR Ledgers read own" on public.ecr_ledgers for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);
create policy "Transfers read own" on public.transfers for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);
create policy "Member accounts read own" on public.member_accounts for select using (
  uan in (select uan from public.members where email = auth.jwt() ->> 'email') or auth.role() = 'service_role'
);

-- Keep establishments publicly readable
-- (Already has public read or create one if missing)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'establishments' and policyname = 'Establishments public read'
  ) then
    execute 'create policy "Establishments public read" on public.establishments for select using (true)';
  end if;
end
$$;
