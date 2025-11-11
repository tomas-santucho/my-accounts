import express, {type Request, type Response } from "express";

export const startServer = () => {
    const app = express();
    const port = 3000;

    app.get("/", (_req: Request, res: Response) => {
        res.send("Hello TypeScript + Express!");

    });

    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
    });
}