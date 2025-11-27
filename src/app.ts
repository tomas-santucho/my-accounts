import { Application } from "express";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { getEnvOrThrow } from "env-utils-js";
import { createApp } from "./infrastructure/http/expressServer";

let cachedDb: Db | null = null;
let cachedClient: MongoClient | null = null;

/**
 * Get or create MongoDB connection
 * Reuses connection for Lambda container reuse
 */
async function getDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoUrl = getEnvOrThrow('MONGO_URI');
  
  const client = new MongoClient(mongoUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();
  cachedClient = client;
  cachedDb = client.db();

  return cachedDb;
}

/**
 * Create and configure Express application
 * This is used by both the local server and Lambda handler
 */
export async function getApp(): Promise<Application> {
  const db = await getDatabase();
  return createApp(db);
}

/**
 * For local development - export a synchronous version
 */
export function createAppSync(db: Db): Application {
  return createApp(db);
}

export default getApp;
