const serverless = require("serverless-http");
const { getApp } = require("./dist/app");

let handler;

module.exports.handler = async (event, context) => {
    if (!handler) {
        const app = await getApp();
        handler = serverless(app);
    }
    return handler(event, context);
};
