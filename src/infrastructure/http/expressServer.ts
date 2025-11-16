import express from "express";
import pinoHttp from "pino-http";
import {logger} from "./logger/logger";
import {globalRateLimiter} from "./rate-limiter/rateLimiter";
import {responseTimeLogger} from "./middlewares/responseTimeLogger";
import {expenseApi} from "./routes/expenseRoutes";
import path from "node:path";
import {Db} from "mongodb";
import {incomeApi} from "./routes/incomeRoutes";

export const startServer = (port: Number, db: Db) => {
    const app = express();

    app.use(pinoHttp({ logger }));
    app.use(express.json());
    app.use(globalRateLimiter);
    app.use(responseTimeLogger);

    app.use("/api", expenseApi(db));
    app.use("/api", incomeApi(db));

    app.get("/users/:userid", function(req) {
        parseInt(req.params.userid, 10);
    });

    var photoPath = path.resolve(__dirname, "offensive-photos-folder");
    app.use("/offensive", express.static(photoPath));

    app.get(/^\/users\/(\d+)$/, function(req, res) {
        // @ts-ignore
        var userId = parseInt(req.params[0], 10);
    });
    app.get(/^\/users\/(\d+)-(\d+)$/, function(req, res) {
        var startId = parseInt(req.params[0], 10);
        var endId = parseInt(req.params[1], 10);

    });

    app.get("/search", function(req, res) {
// req.query.q == "javascript-themed burrito"
// ...
    });

    app.use((_, response)=> {
        response.statusCode = 404;
        response.end("404!");
    });

    app.use(function(err: any, _req: any, _res: any, next: (arg0: any) => void) {
        console.error(err);
        next(err);
    });

    app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));
};
