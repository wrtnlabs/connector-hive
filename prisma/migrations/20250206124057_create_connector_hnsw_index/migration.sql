CREATE INDEX "ConnectorIndex_embedding_idx" ON "public"."ConnectorIndex" USING hnsw (embedding extensions.vector_cosine_ops) WITH (m = 32, ef_construction = 128);
