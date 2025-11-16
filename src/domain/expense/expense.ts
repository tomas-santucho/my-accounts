import { z } from "zod";

export const ExpenseSchema = z.object({
    id: z.string().nonempty().nonoptional(),
    description: z.string().min(1, "Description required"),
    amount: z.number().positive("Amount must be positive"),
    category: z.string().min(1),
    date: z.date(),
    createdAt: z.date(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

export const createExpense = (desc: string, amount: number, cat: string, date: Date): Expense => {
    const expense = {
        id: crypto.randomUUID(),
        description: desc,
        amount,
        category: cat,
        date: date,
        createdAt: new Date(),
    };

    // runtime validation — ensures even if inputs come from unsafe places, domain stays consistent
    return ExpenseSchema.parse(expense);
};