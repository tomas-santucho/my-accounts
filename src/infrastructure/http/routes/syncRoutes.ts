import express from "express";
import { Db } from "mongodb";
import { mongoTransactionRepo } from "../../db/mongoTransactionRepo";
import { TransactionSchema } from "../../../domain/transaction/transaction";
import { z } from "zod";

const SyncRequestSchema = z.object({
    lastSyncTimestamp: z.string().datetime().nullable(),
    changes: z.object({
        created: z.array(TransactionSchema).optional(),
        updated: z.array(TransactionSchema).optional(),
        deleted: z.array(z.string()).optional(), // We might receive just IDs for deletion, but if we use soft delete, we might receive full objects with deletedAt
    }).optional(),
    userId: z.string()
});

export const syncApi = (db: Db) => {
    const router = express.Router();
    const repo = mongoTransactionRepo(db);

    router.post("/sync/transactions", async (req, res, next) => {
        try {
            const body = SyncRequestSchema.parse(req.body);
            const { lastSyncTimestamp, changes, userId } = body;

            // 1. Apply changes from mobile
            if (changes) {
                const transactionsToUpsert = [
                    ...(changes.created || []),
                    ...(changes.updated || [])
                ];

                // For deleted items, if mobile sends just IDs, we need to handle it. 
                // But if mobile sends objects with deletedAt, they are in 'updated' list usually.
                // Let's assume mobile sends full objects for now as per our soft delete plan.
                // If mobile sends explicit 'deleted' list of IDs, we handle them:
                if (changes.deleted && changes.deleted.length > 0) {
                    for (const id of changes.deleted) {
                        await repo.delete(id);
                    }
                }

                if (transactionsToUpsert.length > 0) {
                    await repo.batchUpsert(transactionsToUpsert);
                }
            }

            // 2. Fetch changes from server
            const since = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0);
            const serverChanges = await repo.findChanges(since, userId);

            // 3. Return response
            res.json({
                timestamp: new Date().toISOString(),
                changes: {
                    updated: serverChanges, // Mobile will upsert these (including soft deleted ones)
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                next(error);
            }
        }
    });

    return router;
};
