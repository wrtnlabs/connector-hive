/*
  Warnings:

  - You are about to drop the `Connector` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConnectorIndex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConnectorProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Connector" DROP CONSTRAINT "Connector_providerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ConnectorIndex" DROP CONSTRAINT "ConnectorIndex_connectorId_fkey";

-- DropTable
DROP TABLE "public"."Connector";

-- DropTable
DROP TABLE "public"."ConnectorIndex";

-- DropTable
DROP TABLE "public"."ConnectorProvider";

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApplicationVersion" (
    "id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "applicationId" UUID NOT NULL,

    CONSTRAINT "ApplicationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApplicationConnector" (
    "id" UUID NOT NULL,
    "versionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationConnector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApplicationConnectorIndex" (
    "id" UUID NOT NULL,
    "connectorId" UUID NOT NULL,
    "query" TEXT NOT NULL,
    "embedding" extensions.halfvec(384) NOT NULL,

    CONSTRAINT "ApplicationConnectorIndex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_key" ON "public"."Application"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationVersion_applicationId_version_key" ON "public"."ApplicationVersion"("applicationId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationConnector_versionId_name_key" ON "public"."ApplicationConnector"("versionId", "name");

-- CreateIndex
CREATE INDEX "ConnectorIndex_embedding_idx" ON "public"."ApplicationConnectorIndex"("embedding");

-- AddForeignKey
ALTER TABLE "public"."ApplicationVersion" ADD CONSTRAINT "ApplicationVersion_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationConnector" ADD CONSTRAINT "ApplicationConnector_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "public"."ApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationConnectorIndex" ADD CONSTRAINT "ApplicationConnectorIndex_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "public"."ApplicationConnector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
