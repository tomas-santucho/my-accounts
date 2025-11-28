import { z } from "zod";

export const TransactionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    type: z.enum(["income", "expense"]),
    description: z.string().min(1, "Description required"),
    amount: z.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category required"),
    currency: z.enum(["ars", "usd"]),
    installments: z.number().int().positive().nullish(),
    installmentGroupId: z.string().uuid().nullish(),
    installmentNumber: z.number().int().positive().nullish(),
    date: z.date(),
    createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const createTransaction = (
    userId: string,
    type: "income" | "expense",
    description: string,
    amount: number,
    category: string,
    date: Date,
    currency: "ars" | "usd",
    installments?: number,
    installmentGroupId?: string,
    installmentNumber?: number
): Transaction => {
    const transaction = {
        id: crypto.randomUUID(),
        userId: userId,
        type,
        description,
        amount,
        category,
        currency,
        installments,
        installmentGroupId,
        installmentNumber,
        date,
        createdAt: new Date(),
    };

    return TransactionSchema.parse(transaction);
};
