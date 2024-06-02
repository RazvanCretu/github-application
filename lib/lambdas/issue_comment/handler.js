import { Probot } from "probot";
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

    // await probot.load(createApp(`${context.functionName}.${event.action}`));

    // await probot.webhooks.receive({
    //   // id:
    //   //   event.headers["X-GitHub-Delivery"] ||
    //   //   event.headers["x-github-delivery"],
    //   // signature:
    //   //   event.headers["X-Hub-Signature-256"] ||
    //   //   event.headers["x-hub-signature-256"],
    //   // name: event.headers["X-GitHub-Event"] || event.headers["x-github-event"],
    //   name: context.functionName,
    //   payload: event,
    // });

    return {
      statusCode: 200,
      body: '{"ok":true}',
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.status || 500,
      error: "ooops",
    };
  }
};
