import responseTime from "response-time";
import {logger} from "../logger/logger";

export const responseTimeLogger = responseTime((req, res, time) => {
    const duration = time.toFixed(2);

    logger.info(
        {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            time: `${duration} ms`,
        },
        "Request completed"
    );
});
