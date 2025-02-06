DROP INDEX "ConnectorIndex_embedding_idx";

ALTER TABLE "public"."ConnectorIndex" ALTER COLUMN "embedding" TYPE extensions.halfvec(384) USING "embedding"::extensions.halfvec(384);

CREATE INDEX "ConnectorIndex_embedding_idx" ON "public"."ConnectorIndex" USING hnsw (embedding extensions.halfvec_cosine_ops) WITH (m = 32, ef_construction = 128);
