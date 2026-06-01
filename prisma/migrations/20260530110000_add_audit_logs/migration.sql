CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT,
  "before" JSONB,
  "after" JSONB,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "audit_logs_action_idx"
  ON "audit_logs" ("action");
CREATE INDEX IF NOT EXISTS "audit_logs_actorId_idx"
  ON "audit_logs" ("actorId");
CREATE INDEX IF NOT EXISTS "audit_logs_resource_idx"
  ON "audit_logs" ("resourceType", "resourceId");
CREATE INDEX IF NOT EXISTS "audit_logs_createdAt_idx"
  ON "audit_logs" ("createdAt");
