import express, { Application } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./logger/logger";
import { globalRateLimiter } from "./rate-limiter/rateLimiter";
import { responseTimeLogger } from "./middlewares/responseTimeLogger";
import { transactionApi } from "./routes/transactionRoutes";
import { categoryApi } from "./routes/categoryRoutes";
import { syncApi } from "./routes/syncRoutes";
import path from "node:path";
import { Db } from "mongodb";
import { version } from "../../version";
import { requireAuth } from "../auth/cognitoMiddleware";

export const createApp = (db: Db): Application => {
    const app = express();

    app.set('trust proxy', true);

    // CORS configuration - must be before other middleware
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token'],
        maxAge: 300
    }));

    app.get('/', (_, res) => {
        res.send('My Accounts ' + version);
    });

    app.use(pinoHttp({ logger }));
    app.use(express.json());
    app.use(globalRateLimiter);
    app.use(responseTimeLogger);

    app.use("/api", requireAuth, transactionApi(db));
    app.use("/api", requireAuth, categoryApi(db));
    app.use("/api", requireAuth, syncApi(db));

    app.get("/users/:userid", function (req) {
        parseInt(req.params.userid, 10);
    });

    var photoPath = path.resolve(__dirname, "offensive-photos-folder");
    app.use("/offensive", express.static(photoPath));

    app.get(/^\/users\/(\d+)$/, function (req, res) {
        // @ts-ignore
        var userId = parseInt(req.params[0], 10);
    });
    app.get(/^\/users\/(\d+)-(\d+)$/, function (req, res) {
        // @ts-ignore
        var startId = parseInt(req.params[0], 10);
        // @ts-ignore
        var endId = parseInt(req.params[1], 10);

    });

    app.get("/search", function (req, res) {
        // req.query.q == "javascript-themed burrito"
        // ...
    });

    app.use((_, response) => {
        response.statusCode = 404;
        response.end("404!");
    });

    app.use(function (err: any, _req: any, _res: any, next: (arg0: any) => void) {
        console.error(err);
        next(err);
    });

    return app;
}
