import express from "express";
import { Db } from "mongodb";
import { mongoCategoryRepo } from "../../db/mongoCategoryRepo";
import { createCategory, CategorySchema } from "../../../domain/category/category";
import { z } from "zod";

export const categoryApi = (db: Db) => {
    const router = express.Router();
    const repo = mongoCategoryRepo(db);

    router.get("/categories", async (req, res, next) => {
        try {
            const categories = await repo.findAll();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    });

    router.get("/categories/:id", async (req, res, next) => {
        try {
            const category = await repo.findById(req.params.id);
            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }
            res.json(category);
        } catch (error) {
            next(error);
        }
    });

    router.post("/categories", async (req, res, next) => {
        try {
            const body = req.body;
            const category = createCategory(
                body.name,
                body.icon,
                body.type,
                body.color,
                body.isDefault
            );

            await repo.save(category);
            res.status(201).json(category);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                next(error);
            }
        }
    });

    router.put("/categories/:id", async (req, res, next) => {
        try {
            const id = req.params.id;
            const existing = await repo.findById(id);
            if (!existing) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            const body = req.body;
            const updatedCategory = CategorySchema.parse({
                ...existing,
                ...body,
                id: id,
            });

            await repo.update(updatedCategory);
            res.json(updatedCategory);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.issues });
            } else {
                next(error);
            }
        }
    });

    router.delete("/categories/:id", async (req, res, next) => {
        try {
            const id = req.params.id;
            const existing = await repo.findById(id);
            if (!existing) {
                res.status(404).json({ message: "Category not found" });
                return;
            }
            await repo.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    });

    return router;
};
