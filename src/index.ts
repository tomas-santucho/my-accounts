import { createAppSync } from './app';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { mongoTransactionRepo } from "./infrastructure/db/mongoTransactionRepo";
import { sampleExpenses } from "./config/sampleData";
import { createTransaction } from "./domain/transaction/transaction";
import { getEnvOrThrow } from "env-utils-js";
import { logger } from "./infrastructure/http/logger/logger";

dotenv.config();

const port = Number(process.env['PORT']) || 3000;
const mongoUrl = getEnvOrThrow('MONGO_URI')

async function main() {
  const client = new MongoClient(mongoUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  const db = client.db();


  const app = createAppSync(db);
  const server = app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));

  return { app, server };
}

main().catch(console.error);
