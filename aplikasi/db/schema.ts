import { sqliteTable, text, integer, index, primaryKey, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const organizations = sqliteTable('organizations', {
  id:text().primaryKey(), code:text().notNull().unique(), name:text().notNull(),
  kind:text({enum:['BNPP','KL','PEMDA','UNIT','PLBN']}).notNull(), region:text().notNull(), active:integer().notNull().default(1),
},t=>[check('org_active',sql`${t.active} IN (0,1)`)]);
export const users=sqliteTable('users',{
  id:text().primaryKey(), org_id:text().notNull().references(()=>organizations.id), name:text().notNull(), email:text().notNull().unique(),
  role:text({enum:['admin','user']}).notNull(), password_hash:text().notNull(), active:integer().notNull().default(1),
},t=>[index('idx_users_org').on(t.org_id),check('user_role',sql`${t.role} IN ('admin','user')`),check('user_active',sql`${t.active} IN (0,1)`)]);
export const domains=sqliteTable('domains',{id:text().primaryKey(),code:text().notNull().unique(),name:text().notNull(),description:text().notNull()});
export const locations=sqliteTable('locations',{
  id:text().primaryKey(),code:text().notNull().unique(),name:text().notNull(),region:text().notNull(),
  domain_id:text().notNull().references(()=>domains.id),description:text().notNull(),active:integer().notNull().default(1),
},t=>[index('idx_locations_domain').on(t.domain_id),check('location_active',sql`${t.active} IN (0,1)`)]);
export const assignments=sqliteTable('assignments',{
  org_id:text().notNull().references(()=>organizations.id),location_id:text().notNull().references(()=>locations.id),
},t=>[primaryKey({columns:[t.org_id,t.location_id]}),index('idx_assignments_location').on(t.location_id)]);
export const indicators=sqliteTable('indicators',{
  id:text().primaryKey(),code:text().notNull().unique(),name:text().notNull(),unit:text().notNull(),
  domain_id:text().notNull().references(()=>domains.id),definition:text().notNull(),frequency:text().notNull(),active:integer().notNull().default(1),
},t=>[index('idx_indicators_domain').on(t.domain_id),check('indicator_active',sql`${t.active} IN (0,1)`)]);
export const sessions=sqliteTable('sessions',{
  token_hash:text().primaryKey(),user_id:text().notNull().references(()=>users.id),expires_at:integer().notNull(),
},t=>[index('idx_sessions_expiry').on(t.expires_at),index('idx_sessions_user').on(t.user_id)]);
export const loginLimits=sqliteTable('login_limits',{key:text().primaryKey(),attempts:integer().notNull(),until:integer().notNull()});
export const audits=sqliteTable('audits',{
  id:text().primaryKey(),actor_id:text().notNull().references(()=>users.id),org_id:text().notNull().references(()=>organizations.id),
  action:text().notNull(),entity:text().notNull(),entity_id:text().notNull(),summary:text().notNull(),created_at:integer().notNull(),
},t=>[index('idx_audits_created').on(t.created_at),index('idx_audits_org_created').on(t.org_id,t.created_at)]);
