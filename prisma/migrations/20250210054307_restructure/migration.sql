/*
  Warnings:

  - You are about to drop the column `providerName` on the `Connector` table. All the data in the column will be lost.
  - The primary key for the `ConnectorProvider` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[path,providerId,method]` on the table `Connector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ConnectorProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `Connector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `ConnectorProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Connector" DROP CONSTRAINT "Connector_providerName_fkey";

-- DropIndex
DROP INDEX "public"."Connector_path_providerName_idx";

-- DropIndex
DROP INDEX "public"."Connector_path_providerName_method_key";

-- AlterTable
ALTER TABLE "public"."Connector" DROP COLUMN "providerName",
ADD COLUMN     "providerId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."ConnectorProvider" DROP CONSTRAINT "ConnectorProvider_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "ConnectorProvider_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Connector_path_providerId_idx" ON "public"."Connector"("path", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Connector_path_providerId_method_key" ON "public"."Connector"("path", "providerId", "method");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectorProvider_name_key" ON "public"."ConnectorProvider"("name");

-- AddForeignKey
ALTER TABLE "public"."Connector" ADD CONSTRAINT "Connector_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."ConnectorProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
