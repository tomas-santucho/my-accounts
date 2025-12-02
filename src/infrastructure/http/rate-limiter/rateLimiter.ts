import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,               // limit each IP to 100 requests per window
    standardHeaders: true,    // return rate limit info in the RateLimit-* headers
    legacyHeaders: false,     // disable the old X-RateLimit-* headers
    // Skip trust proxy validation for serverless environments (Lambda)
    validate: { trustProxy: false },
    handler: (_, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, please try again later.",
        });
    },
});