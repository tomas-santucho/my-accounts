import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const envSchema = z.object({
    COGNITO_USER_POOL_ID: z.string(),
    COGNITO_CLIENT_ID: z.string(),
    AWS_REGION: z.string().default("sa-east-1"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.warn("Cognito environment variables missing. Auth middleware will fail if used.", env.error.format());
}

const verifier = env.success
    ? CognitoJwtVerifier.create({
        userPoolId: env.data.COGNITO_USER_POOL_ID,
        tokenUse: "access",
        clientId: env.data.COGNITO_CLIENT_ID,
    })
    : null;

export interface AuthenticatedRequest extends Request {
    user?: {
        sub: string;
        email?: string;
        [key: string]: any;
    };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!verifier) {
        return res.status(500).json({ message: "Server authentication configuration missing" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const payload = await verifier.verify(token);
        req.user = payload;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
