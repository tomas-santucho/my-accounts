import { startServer } from './infrastructure/http/expressServer';
import {MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';
import {mongoExpenseRepo} from "./infrastructure/db/mongoExpenseRepo";
import {sampleExpenses} from "./config/sampleData";
import {createExpense} from "./domain/expense/expense";

dotenv.config();

const port = process.env['PORT'] || 3000;
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

  const expenseRepo = mongoExpenseRepo(db);
  const expenses = await expenseRepo.findAll();
  if (expenses.length === 0) {
    console.log("No expenses found, loading sample data...");
    for (const sample of sampleExpenses) {
      const expense = createExpense(sample.description, sample.amount, sample.category, sample.date);
      await expenseRepo.save(expense);
    }
  }

  startServer(port, db);
}

main().catch(console.error);
