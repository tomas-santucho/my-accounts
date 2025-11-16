import { z } from "zod";

export const TransactionSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(["income", "expense"]),
    description: z.string().min(1, "Description required"),
    amount: z.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category required"),
    date: z.date(),
    createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const createTransaction = (
    type: "income" | "expense",
    description: string,
    amount: number,
    category: string,
    date: Date
): Transaction => {
    const transaction = {
        id: crypto.randomUUID(),
        type,
        description,
        amount,
        category,
        date,
        createdAt: new Date(),
    };

    return TransactionSchema.parse(transaction);
};
