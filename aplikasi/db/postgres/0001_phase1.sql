CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"region" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "org_active" CHECK("organizations"."active" IN (0,1))
);

CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"password_hash" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON UPDATE no action ON DELETE no action,
	CONSTRAINT "user_role" CHECK("users"."role" IN ('admin','user')),
	CONSTRAINT "user_active" CHECK("users"."active" IN (0,1))
);

CREATE TABLE "domains" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);

CREATE TABLE "locations" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"domain_id" text NOT NULL,
	"description" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON UPDATE no action ON DELETE no action,
	CONSTRAINT "location_active" CHECK("locations"."active" IN (0,1))
);

CREATE TABLE "assignments" (
	"org_id" text NOT NULL,
	"location_id" text NOT NULL,
	PRIMARY KEY("org_id", "location_id"),
	FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON UPDATE no action ON DELETE no action,
	FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE "indicators" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"domain_id" text NOT NULL,
	"definition" text NOT NULL,
	"frequency" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON UPDATE no action ON DELETE no action,
	CONSTRAINT "indicator_active" CHECK("indicators"."active" IN (0,1))
);

CREATE TABLE "sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" bigint NOT NULL,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE "login_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"attempts" integer NOT NULL,
	"until" bigint NOT NULL
);

CREATE TABLE "audits" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text NOT NULL,
	"org_id" text NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"summary" text NOT NULL,
	"created_at" bigint NOT NULL,
	FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action,
	FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON UPDATE no action ON DELETE no action
);

CREATE INDEX "idx_assignments_location" ON "assignments" ("location_id");

CREATE INDEX "idx_audits_created" ON "audits" ("created_at");

CREATE INDEX "idx_audits_org_created" ON "audits" ("org_id","created_at");

CREATE UNIQUE INDEX "domains_code_unique" ON "domains" ("code");

CREATE UNIQUE INDEX "indicators_code_unique" ON "indicators" ("code");

CREATE INDEX "idx_indicators_domain" ON "indicators" ("domain_id");

CREATE UNIQUE INDEX "locations_code_unique" ON "locations" ("code");

CREATE INDEX "idx_locations_domain" ON "locations" ("domain_id");

CREATE UNIQUE INDEX "organizations_code_unique" ON "organizations" ("code");

CREATE INDEX "idx_sessions_expiry" ON "sessions" ("expires_at");

CREATE INDEX "idx_sessions_user" ON "sessions" ("user_id");

CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");

CREATE INDEX "idx_users_org" ON "users" ("org_id");
