# connector-hive-api

This is the official SDK library for connector-hive, providing TypeScript/JavaScript bindings for interacting with the connector-hive server.

## Installation

```bash
npm install @wrtnlabs/connector-hive-api
```

## Usage

### Initialize the Client

```typescript
import { createConnection } from "@wrtnlabs/connector-hive-api";

const connection = createConnection({
  host: "http://localhost:37001",
  headers: {
    // Optional: If API_KEY is set on the server
    Authorization: "Bearer your_api_key",
  },
});
```

### Basic Usage Flow

Here's a complete example showing the typical flow of using the connector-hive API:

```typescript
import {
  applicationConnectors,
  applicationVersions,
  applications,
  createConnection,
  health,
} from "@wrtnlabs/connector-hive-api";

async function main() {
  // 1. Initialize connection
  const connection = createConnection({
    host: "http://localhost:37001",
    headers: {
      Authorization: "Bearer your_api_key", // Optional
    },
  });

  // 2. Check server health
  const healthStatus = await health.get(connection);
  console.log("Server health:", healthStatus);

  // 3. Create a new application
  const newApp = await applications.create(connection, {
    name: "my-app",
    description: "My awesome application",
  });
  console.log("Created application:", newApp);

  // 4. Create an application version
  const newVersion = await applicationVersions.create(connection, newApp.id, {
    // version is optional, if not provided, it will auto-increment
    version: 1,
  });
  console.log("Created version:", newVersion);

  // 5. Create a connector
  const newConnector = await applicationConnectors.create(
    connection,
    newVersion.id,
    {
      name: "my-connector",
      description: "My awesome connector",
    },
  );
  console.log("Created connector:", newConnector);

  // 6. Search for connectors
  const searchResults = await applicationConnectors.createRetrievalRequest(
    connection,
    {
      applications: [
        {
          type: "byName",
          name: "my-app",
        },
      ],
      query: "awesome connector",
      limit: 10,
    },
  );
  console.log("Search results:", searchResults);
}

main().catch(console.error);
```

## API Reference

### Health Check

```typescript
const status = await health.get(connection);
```

### Applications

```typescript
// Create application
const app = await applications.create(connection, {
  name: string,
  description?: string
});

// List applications
const apps = await applications.list(connection, {
  limit: number, // 1-100
  lastName?: string // for pagination
});

// Get by ID
const app = await applications.getById(connection, appId);

// Get by name
const app = await applications.getByName(connection, appName);
```

### Application Versions

```typescript
// Create version
const version = await applicationVersions.create(connection, appId, {
  version?: number // optional, auto-increments if not provided
});

// List versions
const versions = await applicationVersions.list(connection, appId, {
  limit: number, // 1-100
  lastVersion?: number // for pagination
});

// Get latest version
const latest = await applicationVersions.getLatest(connection, appId);
```

### Connectors

```typescript
// Create connector
const connector = await applicationConnectors.create(connection, versionId, {
  name: string,
  description?: string
});

// List connectors
const connectors = await applicationConnectors.list(connection, versionId, {
  limit: number, // 1-100
  lastName?: string // for pagination
});

// Search connectors
const results = await applicationConnectors.createRetrievalRequest(connection, {
  applications: [
    {
      type: 'byId' | 'byName',
      id?: string, // required if type is 'byId'
      name?: string, // required if type is 'byName'
      version?: number // optional
    }
  ],
  query: string,
  limit: number // 1-100
});
```

## Error Handling

The SDK throws standard HTTP errors that you can catch and handle:

```typescript
try {
  await applications.create(connection, {
    name: "existing-app", // This will fail if the name already exists
  });
} catch (error) {
  if (error.status === 409) {
    console.error("Application name already exists");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Types

The SDK provides TypeScript types for all request and response objects. You can import them from the package:

```typescript
import type {
  IApplication,
  IApplicationConnector,
  IApplicationConnectorRetrieval,
  IApplicationVersion,
} from "@wrtnlabs/connector-hive-api/lib/structures/connector";
```

## License

MIT License

Copyright (c) 2025 Wrtn Technologies
