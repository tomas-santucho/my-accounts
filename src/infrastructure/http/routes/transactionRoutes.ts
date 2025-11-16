import express from "express";
import {Db} from "mongodb";
import {addExpense} from "../../../app/expense/addExpense";
import {listExpenses} from "../../../app/expense/listExpenses";
import {mongoTransactionRepo} from "../../db/mongoTransactionRepo";


export const transactionApi = (db: Db) => {
    const router = express.Router();
    const repo = mongoTransactionRepo(db)

    router.use(function (req, res, next) {
        // middleware
        next()
    });

    router.get("/expenses", async function (req, res) {
        try {
            const expenses = await listExpenses(repo)();
            res.status(200).json(expenses);
        } catch (error) {
            // basic error handling
            if (error instanceof Error) {
                res.status(400).json({error: error.message});
            } else {
                res.status(500).json({error: "An unexpected error occurred."});
            }
        }
    });
    
    router.post("/expense", async function (req, res) {
        try {
            const {description, amount, category, date} = req.body;
            const createdExpense = await addExpense(repo)({description, amount, category, date: new Date(date)});
            res.status(201).json(createdExpense);
        } catch (error) {
            // basic error handling
            if (error instanceof Error) {
                res.status(400).json({error: error.message});
            } else {
                res.status(500).json({error: "An unexpected error occurred."});
            }
        }
    });


    router.get("/expense/:id", function (req, res) {
        /* ... */
    });

    router.put("/expense/:id", function (req, res) {
        /* ... */
    });

    router.delete("/expense/:id", function (req, res) {
        /* ... */
    });
    return router
}