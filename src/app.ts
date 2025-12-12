import { Application } from "express";
import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { getEnvOrThrow } from "env-utils-js";
import { createApp } from "./infrastructure/http/expressServer";


let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  console.log("getMongoClient: start");
  if (cachedClient) {
    console.log("getMongoClient: returning cached client");
    return cachedClient;
  }

  console.log("getMongoClient: no cached client, creating new one");
  const mongoUrl = getEnvOrThrow('MONGO_URI');

  const client = new MongoClient(mongoUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  console.log("getMongoClient: connecting to mongo");
  await client.connect();
  console.log("getMongoClient: mongo connected");
  cachedClient = client;
  return client;
}

/**
 * This is used by both the local server and Lambda handler
 */
export async function getApp(): Promise<Application> {
  console.log("getApp: start");

  console.log("getApp: before mongo");
  const client = await getMongoClient();
  const db = client.db();
  console.log("getApp: after mongo");

  console.log("getApp: before createApp");
  const app = createApp(db);
  console.log("getApp: after createApp");

  console.log("getApp: done");
  return app;
}

/**
 * For local development - exports a synchronous version
 */
export function createAppSync(db: Db): Application {
  return createApp(db);
}

export default getApp;
