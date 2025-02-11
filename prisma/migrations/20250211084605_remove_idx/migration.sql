-- DropForeignKey
ALTER TABLE "public"."ApplicationConnector" DROP CONSTRAINT "ApplicationConnector_versionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApplicationConnectorIndex" DROP CONSTRAINT "ApplicationConnectorIndex_connectorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApplicationVersion" DROP CONSTRAINT "ApplicationVersion_applicationId_fkey";

-- DropIndex
DROP INDEX "public"."Application_name_id_idx";

-- AddForeignKey
ALTER TABLE "public"."ApplicationVersion" ADD CONSTRAINT "ApplicationVersion_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationConnector" ADD CONSTRAINT "ApplicationConnector_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "public"."ApplicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationConnectorIndex" ADD CONSTRAINT "ApplicationConnectorIndex_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "public"."ApplicationConnector"("id") ON DELETE CASCADE ON UPDATE CASCADE;
