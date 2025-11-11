// src/infrastructure/http/expressServer.ts
import express from "express";
import pinoHttp from "pino-http";
import {logger} from "./logger/logger";

export const startServer = () => {
    const app = express();

    app.use(pinoHttp({ logger }));

    app.get("/", (req, res) => {
        req.log.info("Root route hit");
        res.json({ msg: "Hello from Pino!" });
    });

    const port = process.env["PORT"] || 3000;
    app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));
};
