import { Application } from "express";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { getEnvOrThrow } from "env-utils-js";
import { createApp } from "./infrastructure/http/expressServer";


let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
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
  return client;
}

/**
 * This is used by both the local server and Lambda handler
 */
export async function getApp(): Promise<Application> {
  const client = await getMongoClient();
  const db = client.db();
  return createApp(db);
}

/**
 * For local development - exports a synchronous version
 */
export function createAppSync(db: Db): Application {
  return createApp(db);
}

export default getApp;
