# connector-hive

A connector retrieval server that provides function interfaces for LLMs to interact with external services.

## What is "connector"?

Connector is function interface that can be used to interact with external services. It is designed to be used by LLMs as tool.

## Prerequisites

### 1. PostgreSQL with pgvector extension

This server requires PostgreSQL with the `pgvector` extension to store vector embeddings.

#### Using Docker (Recommended)

```bash
docker run -d \
  --name postgres-vector \
  -e POSTGRES_USER=your_user \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=your_database \
  -p 5432:5432 \
  pgvector/pgvector:pg17
```

#### Manual Installation

If you prefer to use an existing PostgreSQL instance, follow the instructions in the [pgvector docs](https://github.com/pgvector/pgvector) to install the extension.

### 2. Cohere API Key

The server uses Cohere API to generate embeddings. Get your API key by:

1. Sign up at [Cohere](https://cohere.com/)
2. Navigate to [API Key section](https://dashboard.cohere.com/api-keys)
3. Create a new API key

## Installation & Usage

### Using Docker (Recommended)

1. Pull the latest image:

```bash
docker pull ghcr.io/wrtnlabs/connector-hive:latest
```

2. Create a `.env` file based on the example:

```env
PROJECT_API_PORT=37001
DATABASE_URL=postgresql://your_user:your_password@host.docker.internal:5432/your_database
COHERE_API_KEY=your_cohere_api_key
API_KEY=your_optional_api_key  # Optional: If set, all requests except GET /health must include this key
```

3. Run the container:

```bash
docker run -d \
  --name connector-hive \
  --env-file .env \
  -p 37001:37001 \
  ghcr.io/wrtnlabs/connector-hive:latest
```

### Using NPM Client SDK

We also provide a TypeScript/JavaScript client SDK:

```bash
npm install @wrtnlabs/connector-hive-api
```

For SDK usage, please refer to the [API documentation](packages/api/README.md).

## Authentication

The server supports basic API key authentication:

- If `API_KEY` is set in the environment variables, all requests except `GET /health` must include this key in the `Authorization` header:
  ```
  Authorization: Bearer your_api_key
  ```
- If `API_KEY` is not set, the server operates without authentication.

## Health Check

You can verify the server is running by making a GET request to the health endpoint:

```bash
curl http://localhost:37001/health
```

## Development

1. Clone the repository:

```bash
git clone https://github.com/wrtnlabs/connector-hive.git
cd connector-hive
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:

```bash
npm run dev
```

## License

MIT License

Copyright (c) 2025 Wrtn Technologies
