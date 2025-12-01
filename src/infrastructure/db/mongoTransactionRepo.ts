import { TransactionRepository } from "../../domain/transaction/transactionRepository";
import { Db } from "mongodb";
import { Transaction, TransactionSchema } from "../../domain/transaction/transaction";

export const mongoTransactionRepo = (db: Db): TransactionRepository & {
    findAllForCurrentMonth: () => Promise<Transaction[]>;
    findChanges: (since: Date, userId: string) => Promise<Transaction[]>;
    batchUpsert: (transactions: Transaction[]) => Promise<void>;
} => ({
    async save(transaction: Transaction) {
        await db.collection("transactions").insertOne(transaction);
    },

    async findAll() {
        const docs = await db.collection("transactions").find({ deletedAt: { $eq: null } }).toArray();
        return docs.map((d) =>
            TransactionSchema.parse({
                ...d,
                createdAt: new Date(d["createdAt"]),
                date: new Date(d["date"]),
                updatedAt: new Date(d["updatedAt"]),
                deletedAt: d["deletedAt"] ? new Date(d["deletedAt"]) : null
            })
        );
    },

    async findById(id: string) {
        const doc = await db.collection("transactions").findOne({ id, deletedAt: { $eq: null } });
        return doc
            ? TransactionSchema.parse({
                ...doc,
                createdAt: new Date(doc["createdAt"]),
                date: new Date(doc["date"]),
                updatedAt: new Date(doc["updatedAt"]),
                deletedAt: doc["deletedAt"] ? new Date(doc["deletedAt"]) : null
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
                deletedAt: { $eq: null }
            })
            .toArray();

        return docs.map((d) =>
            TransactionSchema.parse({
                ...d,
                createdAt: new Date(d["createdAt"]),
                date: new Date(d["date"]),
                updatedAt: new Date(d["updatedAt"]),
                deletedAt: d["deletedAt"] ? new Date(d["deletedAt"]) : null
            })
        );
    },

    async update(transaction: Transaction) {
        const toUpdate = { ...transaction, updatedAt: new Date() };
        await db.collection("transactions").updateOne(
            { id: transaction.id },
            { $set: toUpdate }
        );
    },

    async delete(id: string) {
        await db.collection("transactions").updateOne(
            { id },
            { $set: { deletedAt: new Date(), updatedAt: new Date() } }
        );
    },

    async deleteByInstallmentGroupId(installmentGroupId: string) {
        await db.collection("transactions").updateMany(
            { installmentGroupId },
            { $set: { deletedAt: new Date(), updatedAt: new Date() } }
        );
    },

    async findChanges(since: Date, userId: string) {
        const docs = await db.collection("transactions").find({
            updatedAt: { $gt: since },
            userId
        }).toArray();
        return docs.map((d) =>
            TransactionSchema.parse({
                ...d,
                createdAt: new Date(d["createdAt"]),
                date: new Date(d["date"]),
                updatedAt: new Date(d["updatedAt"]),
                deletedAt: d["deletedAt"] ? new Date(d["deletedAt"]) : null
            })
        );
    },

    async batchUpsert(transactions: Transaction[]) {
        if (transactions.length === 0) return;

        // 1. Fetch existing transactions to compare timestamps
        const ids = transactions.map(t => t.id);
        const existingDocs = await db.collection("transactions").find({ id: { $in: ids } }).toArray();
        const existingMap = new Map(existingDocs.map(d => [d["id"], d]));

        // 2. Filter transactions that are newer than what we have
        const transactionsToWrite = transactions.filter(t => {
            const existing = existingMap.get(t.id);
            if (!existing) return true; // New transaction

            // Handle potential missing updatedAt on legacy records
            if (!existing["updatedAt"]) return true;

            const existingUpdatedAt = new Date(existing["updatedAt"]);
            const incomingUpdatedAt = new Date(t.updatedAt);

            return incomingUpdatedAt > existingUpdatedAt;
        });

        if (transactionsToWrite.length === 0) return;

        const operations = transactionsToWrite.map(t => ({
            updateOne: {
                filter: { id: t.id },
                update: { $set: t },
                upsert: true
            }
        }));
        await db.collection("transactions").bulkWrite(operations);
    }
});
