import { TransactionRepository } from "../../domain/transaction/transactionRepository";
import { Db } from "mongodb";
import { Transaction, TransactionSchema } from "../../domain/transaction/transaction";

export const mongoTransactionRepo = (db: Db): TransactionRepository & {
    findAllForCurrentMonth: () => Promise<Transaction[]>;
} => ({
    async save(transaction: Transaction) {
        await db.collection("transactions").insertOne(transaction);
    },

    async findAll() {
        const docs = await db.collection("transactions").find().toArray();
        return docs.map((d) =>
            TransactionSchema.parse({ ...d, createdAt: new Date(d["createdAt"]), date: new Date(d["date"]) })
        );
    },

    async findById(id: string) {
        const doc = await db.collection("transactions").findOne({ id });
        return doc
            ? TransactionSchema.parse({
                ...doc,
                createdAt: new Date(doc["createdAt"]),
                date: new Date(doc["date"]),
            })
            : null;
    },

    async findAllForCurrentMonth() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const docs = await db
            .collection("transactions")
            .find({
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth,
                },
            })
            .toArray();

        return docs.map((d) =>
            TransactionSchema.parse({ ...d, createdAt: new Date(d["createdAt"]), date: new Date(d["date"]) })
        );
    },

    async update(transaction: Transaction) {
        await db.collection("transactions").updateOne(
            { id: transaction.id },
            { $set: transaction }
        );
    },

    async delete(id: string) {
        await db.collection("transactions").deleteOne({ id });
    },

    async deleteByInstallmentGroupId(installmentGroupId: string) {
        await db.collection("transactions").deleteMany({ installmentGroupId });
    },
});
