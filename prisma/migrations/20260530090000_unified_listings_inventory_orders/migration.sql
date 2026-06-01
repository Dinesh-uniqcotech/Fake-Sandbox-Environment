ALTER TABLE "listings"
  ADD COLUMN IF NOT EXISTS "platform" TEXT NOT NULL DEFAULT 'amazon',
  ADD COLUMN IF NOT EXISTS "inventorySku" TEXT,
  ADD COLUMN IF NOT EXISTS "platformFields" JSONB NOT NULL DEFAULT '{}';

UPDATE "listings"
SET "inventorySku" = "sku"
WHERE "inventorySku" IS NULL;

DROP INDEX IF EXISTS "listings_sellerId_sku_key";
DROP INDEX IF EXISTS "inventory_platform_sku_key";
DROP INDEX IF EXISTS "inventory_platform_idx";

INSERT INTO "inventory" ("id", "sku", "quantity", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  "sku",
  COALESCE(
    MAX(
      CASE
        WHEN "payload"->>'quantity' ~ '^[0-9]+$'
          THEN ("payload"->>'quantity')::integer
        ELSE 0
      END
    ),
    0
  ),
  MIN("createdAt"),
  MAX("updatedAt")
FROM "listings"
GROUP BY "sku"
ON CONFLICT DO NOTHING;

UPDATE "listings"
SET "platformFields" = "payload"
WHERE "platform" = 'amazon'
  AND "platformFields" = '{}';

INSERT INTO "inventory" ("id", "sku", "quantity", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "sku", COALESCE(MAX("quantity"), 0), MIN("createdAt"), MAX("updatedAt")
FROM "listings_flipkart"
GROUP BY "sku"
ON CONFLICT DO NOTHING;

INSERT INTO "listings" (
  "id",
  "platform",
  "sellerId",
  "sku",
  "inventorySku",
  "submissionId",
  "status",
  "payload",
  "platformFields",
  "webhookUrl",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  'flipkart',
  "sellerId",
  "sku",
  "sku",
  "submissionId",
  "status",
  "payload",
  jsonb_strip_nulls(jsonb_build_object(
    'channelSkuId', "channelSkuId",
    'productId', "productId",
    'price', "price",
    'quantity', "quantity",
    'hsn', "hsn",
    'gstRate', "gstRate",
    'fulfillment', "fulfillment"
  )),
  "webhookUrl",
  "createdAt",
  "updatedAt"
FROM "listings_flipkart"
ON CONFLICT ("submissionId") DO NOTHING;

INSERT INTO "inventory" ("id", "sku", "quantity", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "sku", COALESCE(MAX("quantity"), 0), MIN("createdAt"), MAX("updatedAt")
FROM "listings_walmart"
GROUP BY "sku"
ON CONFLICT DO NOTHING;

INSERT INTO "listings" (
  "id",
  "platform",
  "sellerId",
  "sku",
  "inventorySku",
  "submissionId",
  "status",
  "payload",
  "platformFields",
  "webhookUrl",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  'walmart',
  "sellerId",
  "sku",
  "sku",
  "submissionId",
  "status",
  "payload",
  jsonb_strip_nulls(jsonb_build_object(
    'itemId', "itemId",
    'price', "price",
    'quantity', "quantity",
    'upc', "upc",
    'mpn', "mpn",
    'brand', "brand",
    'shippingTemplate', "shippingTemplate"
  )),
  "webhookUrl",
  "createdAt",
  "updatedAt"
FROM "listings_walmart"
ON CONFLICT ("submissionId") DO NOTHING;

INSERT INTO "inventory" ("id", "sku", "quantity", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "sku", COALESCE(MAX("quantity"), 0), MIN("createdAt"), MAX("updatedAt")
FROM "listings_ebay"
GROUP BY "sku"
ON CONFLICT DO NOTHING;

INSERT INTO "listings" (
  "id",
  "platform",
  "sellerId",
  "sku",
  "inventorySku",
  "submissionId",
  "status",
  "payload",
  "platformFields",
  "webhookUrl",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  'ebay',
  "sellerId",
  "sku",
  "sku",
  "submissionId",
  "status",
  "payload",
  jsonb_strip_nulls(jsonb_build_object(
    'itemId', "itemId",
    'listingType', "listingType",
    'startPrice', "startPrice",
    'buyItNowPrice', "buyItNowPrice",
    'condition', "condition",
    'quantity', "quantity",
    'title', "title"
  )),
  "webhookUrl",
  "createdAt",
  "updatedAt"
FROM "listings_ebay"
ON CONFLICT ("submissionId") DO NOTHING;

INSERT INTO "inventory" ("id", "sku", "quantity", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "sku", COALESCE(MAX("quantity"), 0), MIN("createdAt"), MAX("updatedAt")
FROM "listings_marketplace"
GROUP BY "sku"
ON CONFLICT DO NOTHING;

INSERT INTO "listings" (
  "id",
  "platform",
  "sellerId",
  "sku",
  "inventorySku",
  "submissionId",
  "status",
  "payload",
  "platformFields",
  "webhookUrl",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "platform",
  "sellerId",
  "sku",
  "sku",
  "submissionId",
  "status",
  "payload",
  "platformFields",
  "webhookUrl",
  "createdAt",
  "updatedAt"
FROM "listings_marketplace"
ON CONFLICT ("submissionId") DO NOTHING;

WITH collapsed AS (
  SELECT
    MIN("id") AS "id",
    "sku",
    MAX("quantity") AS "quantity",
    MIN("createdAt") AS "createdAt",
    MAX("updatedAt") AS "updatedAt"
  FROM "inventory"
  GROUP BY "sku"
),
deleted AS (
  DELETE FROM "inventory"
  WHERE "id" NOT IN (SELECT "id" FROM collapsed)
)
UPDATE "inventory" AS i
SET
  "quantity" = c."quantity",
  "createdAt" = c."createdAt",
  "updatedAt" = c."updatedAt"
FROM collapsed c
WHERE i."id" = c."id";

ALTER TABLE "inventory"
  DROP COLUMN IF EXISTS "platform";

ALTER TABLE "listings"
  ALTER COLUMN "inventorySku" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "inventory_sku_key"
  ON "inventory" ("sku");
CREATE UNIQUE INDEX IF NOT EXISTS "listings_platform_sellerId_sku_key"
  ON "listings" ("platform", "sellerId", "sku");
CREATE INDEX IF NOT EXISTS "listings_platform_idx"
  ON "listings" ("platform");
CREATE INDEX IF NOT EXISTS "listings_inventorySku_idx"
  ON "listings" ("inventorySku");

ALTER TABLE "listings"
  ADD CONSTRAINT "listings_inventorySku_fkey"
  FOREIGN KEY ("inventorySku") REFERENCES "inventory"("sku")
  ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS "orders" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "platform" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "marketplaceOrderId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "orderedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "listingId" TEXT,
  "inventorySku" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPrice" DOUBLE PRECISION,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "order_items_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "orders"("id")
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "order_items_listingId_fkey"
    FOREIGN KEY ("listingId") REFERENCES "listings"("id")
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "order_items_inventorySku_fkey"
    FOREIGN KEY ("inventorySku") REFERENCES "inventory"("sku")
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS "orders_platform_sellerId_marketplaceOrderId_key"
  ON "orders" ("platform", "sellerId", "marketplaceOrderId");
CREATE INDEX IF NOT EXISTS "orders_platform_idx"
  ON "orders" ("platform");
CREATE INDEX IF NOT EXISTS "orders_sellerId_idx"
  ON "orders" ("sellerId");
CREATE INDEX IF NOT EXISTS "orders_status_idx"
  ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "orders_orderedAt_idx"
  ON "orders" ("orderedAt");
CREATE INDEX IF NOT EXISTS "order_items_orderId_idx"
  ON "order_items" ("orderId");
CREATE INDEX IF NOT EXISTS "order_items_sku_idx"
  ON "order_items" ("sku");
CREATE INDEX IF NOT EXISTS "order_items_listingId_idx"
  ON "order_items" ("listingId");
CREATE INDEX IF NOT EXISTS "order_items_inventorySku_idx"
  ON "order_items" ("inventorySku");

DROP TABLE IF EXISTS "listings_marketplace";
DROP TABLE IF EXISTS "listings_flipkart";
DROP TABLE IF EXISTS "listings_walmart";
DROP TABLE IF EXISTS "listings_ebay";
