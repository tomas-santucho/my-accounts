const serverless = require("serverless-http");
const { getApp } = require("./dist/app");

let handler;

module.exports.handler = async (event, context) => {
    console.log("handler start");
    context.callbackWaitsForEmptyEventLoop = false;

    if (!handler) {
        console.log("cold start: before getApp");
        const app = await getApp();
        console.log("cold start: after getApp");
        handler = serverless(app);
        console.log("cold start: serverless wrapped");
    }

    console.log("before handler(event)");
    const result = await handler(event, context);
    console.log("after handler(event)");

    console.log(
        "active handles:",
        process._getActiveHandles().map(h => h.constructor.name)
    );

    console.log(
        "active requests:",
        process._getActiveRequests()
    );

    return result;
};
