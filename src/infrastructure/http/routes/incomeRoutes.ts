import express from "express";
import {Db} from "mongodb";

export const incomeApi = (db: Db) => {
    const router = express.Router();

    router.use(function (req, res, next) {
        // middleware
        next()
    });

    router.get("/incomes", function (req, res) {
        res.send("holaaaa")
    });
    router.post("/income", async function (req, res) {
        // to be implemented
    });


    router.get("/income/:id", function (req, res) {
        /* ... */
    });

    router.put("/income/:id", function (req, res) {
        /* ... */
    });

    router.delete("/income/:id", function (req, res) {
        /* ... */
    });
    return router
}