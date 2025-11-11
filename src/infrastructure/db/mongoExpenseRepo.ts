import {ExpenseRepository} from "../../domain/expense/expenseRepository";
import {Db} from "mongodb";
import {Expense, ExpenseSchema} from "../../domain/expense/expense";

export const mongoExpenseRepo = (db: Db): ExpenseRepository => ({
    async save(expense: Expense) {
        await db.collection("expenses").insertOne(expense);
    },

    async findAll() {
        const docs = await db.collection("expenses").find().toArray();
        // validate and cast to domain entities
        return docs.map((d) => ExpenseSchema.parse({ ...d, createdAt: new Date(d["createdAt"]) }));
    },

    async findById(id: string) {
        const doc = await db.collection("expenses").findOne({ id });
        return doc ? ExpenseSchema.parse({ ...doc, createdAt: new Date(doc["createdAt"]) }) : null;
    },
});