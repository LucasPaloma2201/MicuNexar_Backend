-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nexers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "public_name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "verification_status" VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nexers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER,
    "venture_id" INTEGER,
    "location_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(25) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "nexer_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventures" (
    "id" SERIAL NOT NULL,
    "nexer_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key"
ON "auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key"
ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_locations_province_name"
ON "locations"("name")
WHERE (parent_id IS NULL);

-- CreateIndex
CREATE UNIQUE INDEX "uq_locations_parent_name"
ON "locations"("parent_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "nexers_user_id_key"
ON "nexers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key"
ON "users"("email");

-- AddForeignKey
ALTER TABLE "auth"
ADD CONSTRAINT "fk_auth_users"
FOREIGN KEY ("user_id")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations"
ADD CONSTRAINT "fk_locations_parent"
FOREIGN KEY ("parent_id")
REFERENCES "locations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nexers"
ADD CONSTRAINT "fk_nexers_users"
FOREIGN KEY ("user_id")
REFERENCES "users"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests"
ADD CONSTRAINT "fk_requests_locations"
FOREIGN KEY ("location_id")
REFERENCES "locations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests"
ADD CONSTRAINT "fk_requests_services"
FOREIGN KEY ("service_id")
REFERENCES "services"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests"
ADD CONSTRAINT "fk_requests_users"
FOREIGN KEY ("user_id")
REFERENCES "users"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests"
ADD CONSTRAINT "fk_requests_ventures"
FOREIGN KEY ("venture_id")
REFERENCES "ventures"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services"
ADD CONSTRAINT "fk_services_categories"
FOREIGN KEY ("category_id")
REFERENCES "categories"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services"
ADD CONSTRAINT "fk_services_locations"
FOREIGN KEY ("location_id")
REFERENCES "locations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services"
ADD CONSTRAINT "fk_services_nexers"
FOREIGN KEY ("nexer_id")
REFERENCES "nexers"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventures"
ADD CONSTRAINT "fk_ventures_categories"
FOREIGN KEY ("category_id")
REFERENCES "categories"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventures"
ADD CONSTRAINT "fk_ventures_locations"
FOREIGN KEY ("location_id")
REFERENCES "locations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventures"
ADD CONSTRAINT "fk_ventures_nexers"
FOREIGN KEY ("nexer_id")
REFERENCES "nexers"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Restricciones de integridad

ALTER TABLE "locations"
ADD CONSTRAINT "ck_locations_parent"
CHECK (
    "parent_id" IS NULL
    OR "parent_id" <> "id"
);

ALTER TABLE "nexers"
ADD CONSTRAINT "ck_nexers_verification"
CHECK (
    "verification_status" IN (
        'PENDING',
        'APPROVED',
        'REJECTED'
    )
);

ALTER TABLE "requests"
ADD CONSTRAINT "ck_requests_target"
CHECK (
    num_nonnulls("service_id", "venture_id") = 1
);

ALTER TABLE "requests"
ADD CONSTRAINT "ck_requests_status"
CHECK (
    "status" IN (
        'PENDING',
        'ACCEPTED',
        'IN_PROGRESS',
        'AWAITING_CONFIRMATION',
        'COMPLETED',
        'CANCELLED',
        'REJECTED'
    )
);

ALTER TABLE "requests"
ADD CONSTRAINT "ck_requests_completed"
CHECK (
    ("status" = 'COMPLETED' AND "completed_at" IS NOT NULL)
    OR
    ("status" <> 'COMPLETED' AND "completed_at" IS NULL)
);