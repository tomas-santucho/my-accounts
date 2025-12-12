import express from "express";
import { Db } from "mongodb";
import { mongoTransactionRepo } from "../../db/mongoTransactionRepo";
import { createTransaction, TransactionSchema } from "../../../domain/transaction/transaction";
import { z } from "zod";
import { Parser } from "json2csv";

export const transactionApi = (db: Db) => {
    const router = express.Router();
    const repo = mongoTransactionRepo(db);

    router.get("/transactions", async (req, res, next) => {
        try {
            const transactions = await repo.findAll();
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    });

    router.get("/transactions/export", async (req, res, next) => {
        try {
            const transactions = await repo.findAll();
            const fields = ["id", "userId", "type", "description", "amount", "category", "date", "currency", "installments", "installmentGroupId", "installmentNumber", "createdAt"];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(transactions);

            res.header("Content-Type", "text/csv");
            res.header("Content-Disposition", "attachment; filename=transactions.csv");
            res.send(csv);
        } catch (error) {
            next(error);
        }
    });

    router.get("/transactions/:id", async (req, res, next) => {
        try {
            const transaction = await repo.findById(req.params.id);
            if (!transaction) {
                res.status(404).json({ message: "Transaction not found" });
                return;
            }
            res.json(transaction);
        } catch (error) {
            next(error);
        }
    });

    router.post("/transactions", async (req, res, next) => {
        try {
            const body = req.body;
            const transaction = createTransaction(
                body.userId,
                body.type,
                body.description,
                body.amount,
                body.category,
                new Date(body.date),
                body.currency,
                body.installments,
                body.installmentGroupId,
                body.installmentNumber
            );

            await repo.save(transaction);
            res.status(201).json(transaction);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                next(error);
            }
        }
    });

    router.put("/transactions/:id", async (req, res, next) => {
        try {
            const id = req.params.id;
            const existing = await repo.findById(id);
            if (!existing) {
                res.status(404).json({ message: "Transaction not found" });
                return;
            }

            const body = req.body;
            const updatedTransaction = TransactionSchema.parse({
                ...existing,
                ...body,
                id: id, // Ensure ID doesn't change
                date: new Date(body.date || existing.date),
                createdAt: new Date(existing.createdAt) // Keep original createdAt
            });

            await repo.update(updatedTransaction);
            res.json(updatedTransaction);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                next(error);
            }
        }
    });

    router.delete("/transactions/:id", async (req, res, next) => {
        try {
            const id = req.params.id;
            const existing = await repo.findById(id);
            if (!existing) {
                res.status(404).json({ message: "Transaction not found" });
                return;
            }
            await repo.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    });

    router.delete("/transactions/installment-group/:installmentGroupId", async (req, res, next) => {
        try {
            const installmentGroupId = req.params.installmentGroupId;
            await repo.deleteByInstallmentGroupId(installmentGroupId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    });

    return router;
};