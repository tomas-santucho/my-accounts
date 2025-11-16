import { startServer } from './infrastructure/http/expressServer';
import {MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';
import {mongoTransactionRepo} from "./infrastructure/db/mongoTransactionRepo";
import {sampleExpenses} from "./config/sampleData";
import {createTransaction} from "./domain/transaction/transaction";

dotenv.config();

const port = Number(process.env['PORT']) || 3000;
const mongoUrl = process.env['MONGO_URI'];

async function main() {
  const client = new MongoClient(mongoUrl , {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  const db = client.db();

  const expenseRepo = mongoTransactionRepo(db);
  const expenses = await expenseRepo.findAll();
  if (expenses.length === 0) {
    console.log("No expenses found, loading sample data...");

    await Promise.all(
        sampleExpenses.map(sample => {
          const expense = createTransaction(
              sample.type,
              sample.description,
              sample.amount,
              sample.category,
              sample.date
          );
          return expenseRepo.save(expense);
        })
    );
  }


  startServer(port, db);
}

main().catch(console.error);
