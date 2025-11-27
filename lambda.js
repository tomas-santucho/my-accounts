const serverless = require("serverless-http");
import {getApp} from "./src/app.js";

let handler;

module.exports.handler = async (event, context) => {
    if (!handler) {
        const app = await getApp();
        handler = serverless(app);
    }

    return handler(event, context);
};
