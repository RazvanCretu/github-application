import { Probot } from "probot";
import actions from "./actions.js";
import { getSecretString } from "../../utilities/index.js";

export const handler = async (event, context) => {
  try {
    // Node.js
    context.callbackWaitsForEmptyEventLoop = false;

    // Probot
    const secret = "ZGV2ZWxvcG1lbnQ=";
    const probot = new Probot({
      appId: 911403,
      secret: secret,
      privateKey: await getSecretString("private-key"),
    });

    const eventAction = `${context.functionName}.${event.action}`;
    await probot.load((app) => {
      app.on(eventAction, actions[eventAction]);
    });

    await probot.webhooks.receive({
      name: context.functionName,
      payload: event,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.status || 500,
      error: "ooops",
    };
  }
};
