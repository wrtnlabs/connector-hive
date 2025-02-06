# connector-hive

A connector retrieval server.

## What is "connector"?

Connector is function interface that can be used to interact with external services. It is designed to be used by LLMs as tool.

## Dependencies

### 1. pgvector extension

It uses the `pgvector` extension to store vector embeddings.

Follow the instructions in the [pgvector docs](https://github.com/pgvector/pgvector) to install it.

### 2. Cohere API

It uses the Cohere API to generate embeddings.

Follow the instructions in the [Cohere docs](https://docs.cohere.com/reference/embed) to get your own API key.
