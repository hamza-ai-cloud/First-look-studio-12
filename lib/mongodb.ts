import { Db, MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export type MongoErrorCategory =
  | 'missing_environment_variable'
  | 'authentication'
  | 'network_access'
  | 'dns'
  | 'timeout'
  | 'invalid_connection_string'
  | 'server_selection'
  | 'unknown';

export function getMongoErrorDetails(error: unknown): {
  name: string;
  message: string;
  code?: number | string;
  codeName?: string;
  errorType: MongoErrorCategory;
} {
  const normalized = error as {
    name?: string;
    message?: string;
    code?: number | string;
    codeName?: string;
  };

  const name = normalized?.name || 'UnknownError';
  const message = normalized?.message || 'Unknown MongoDB error.';
  const code = normalized?.code;
  const codeName = normalized?.codeName || undefined;

  const text = `${name} ${message} ${codeName || ''}`.toLowerCase();

  let errorType: MongoErrorCategory = 'unknown';

  if (!process.env.MONGODB_URI) {
    errorType = 'missing_environment_variable';
  } else if (
    /auth|authentication|unauthorized|not authorized|authentication failed/i.test(text) ||
    code === 18 ||
    code === 8000
  ) {
    errorType = 'authentication';
  } else if (
    /connection refused|econnrefused|networktimeout|network error|tls|handshake|connection closed|failed to connect/i.test(text) ||
    /connection.*refused|network.*error/i.test(text)
  ) {
    errorType = 'network_access';
  } else if (/enotfound|dns|nodename|no address associated with hostname|getaddrinfo/i.test(text)) {
    errorType = 'dns';
  } else if (/timed out|timeout|server selection timeout|operation timed out/i.test(text) || code === 50) {
    errorType = 'timeout';
  } else if (/invalid connection string|uri malformed|invalid uri|mongodb uri|scheme/i.test(text)) {
    errorType = 'invalid_connection_string';
  } else if (/server selection|topology|failed to connect to server|unable to connect to server/i.test(text)) {
    errorType = 'server_selection';
  }

  return {
    name,
    message,
    code,
    codeName,
    errorType,
  };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'firstlookstudio';

  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Add it to your environment variables.');
  }

  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    }).connect();
  }

  const client = await globalThis._mongoClientPromise;
  return { client, db: client.db(dbName) };
}
