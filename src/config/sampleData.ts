import { Transaction } from "../domain/transaction/transaction";

export const sampleExpenses: Omit<Transaction, "id" | "createdAt">[] = [
    {
        userId: "1234",
        type: "expense",
        description: "Groceries",
        amount: 50.0,
        category: "Food",
        date: new Date("2025-01-15"),
    },
    {
        userId: "1234",
        type: "expense",
        description: "Gasoline",
        amount: 30.0,
        category: "Transportation",
        date: new Date("2025-01-16"),
    },
    {
        userId: "1234",
        type: "expense",
        description: "Movie tickets",
        amount: 25.0,
        category: "Entertainment",
        date: new Date("2025-01-17"),
    },
];
