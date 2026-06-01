CREATE TABLE IF NOT EXISTS "marketplace_field_mappings" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "platform" TEXT NOT NULL,
  "marketplaceName" TEXT NOT NULL,
  "fields" JSONB NOT NULL,
  "mapping" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "marketplace_field_mappings_platform_key"
  ON "marketplace_field_mappings" ("platform");
CREATE INDEX IF NOT EXISTS "marketplace_field_mappings_marketplaceName_idx"
  ON "marketplace_field_mappings" ("marketplaceName");
