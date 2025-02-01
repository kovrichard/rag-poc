/*
  m: The maximum number of connections per layer in the graph.
  ef_construction: The size of the dynamic list for the nearest neighbors.
*/

CREATE INDEX ON documents
USING hnsw
(embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

DROP INDEX "documents_embedding_idx";
