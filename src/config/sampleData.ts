import { Expense } from "../domain/expense/expense";

export const sampleExpenses: Omit<Expense, "id" | "createdAt">[] = [
    {
        description: "Groceries",
        amount: 50.0,
        category: "Food",
        date: new Date("2025-01-15"),
    },
    {
        description: "Gasoline",
        amount: 30.0,
        category: "Transportation",
        date: new Date("2025-01-16"),
    },
    {
        description: "Movie tickets",
        amount: 25.0,
        category: "Entertainment",
        date: new Date("2025-01-17"),
    },
];
