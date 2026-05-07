-- PaperPe: manual follow-up for the remaining Supabase default ACL gap
--
-- Why this exists:
-- The live tables and functions are already hardened, but the connector could
-- not change the default privileges owned by `supabase_admin`.
--
-- PostgreSQL only allows ALTER DEFAULT PRIVILEGES for your own role or roles
-- you are a member of. Run this in the Supabase SQL editor using the highest
-- available project-owner context.

alter default privileges for role supabase_admin in schema public
  revoke all on tables from public, anon, authenticated;

alter default privileges for role supabase_admin in schema public
  revoke all on sequences from public, anon, authenticated;

alter default privileges for role supabase_admin in schema public
  revoke execute on functions from public, anon, authenticated;

-- Verification query:
-- select ns.nspname, default_acl.defaclobjtype, default_acl.defaclacl
-- from pg_default_acl as default_acl
-- join pg_namespace as ns on ns.oid = default_acl.defaclnamespace
-- where ns.nspname = 'public'
-- order by default_acl.defaclobjtype;
