-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "extensions";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

-- CreateTable
CREATE TABLE "public"."ConnectorProvider" (
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectorProvider_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Connector" (
    "id" UUID NOT NULL,
    "providerName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConnectorIndex" (
    "id" UUID NOT NULL,
    "connectorId" UUID NOT NULL,
    "query" TEXT NOT NULL,
    "embedding" extensions.vector(384) NOT NULL,

    CONSTRAINT "ConnectorIndex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Connector_path_providerName_idx" ON "public"."Connector"("path", "providerName");

-- CreateIndex
CREATE UNIQUE INDEX "Connector_path_providerName_method_key" ON "public"."Connector"("path", "providerName", "method");

-- AddForeignKey
ALTER TABLE "public"."Connector" ADD CONSTRAINT "Connector_providerName_fkey" FOREIGN KEY ("providerName") REFERENCES "public"."ConnectorProvider"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectorIndex" ADD CONSTRAINT "ConnectorIndex_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "public"."Connector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
