import { LambdaClient, InvokeCommand, LogType } from "@aws-sdk/client-lambda";

const client = new LambdaClient({});

const invoke = async (event, payload) => {
  const command = new InvokeCommand({
    FunctionName: `${event}`,
    Payload: payload,
    LogType: LogType.Tail,
  });

  const { Payload, LogResult } = await client.send(command);

  const result = Buffer.from(Payload).toString();
  const logs = Buffer.from(LogResult, "base64").toString();

  return { logs, result };
};

export const handler = async (event, context) => {
  try {
    // Node.js
    context.callbackWaitsForEmptyEventLoop = false;

    const { result } = await invoke(
      event.headers["X-GitHub-Event"] || event.headers["x-github-event"],
      event.body
    );

    return JSON.parse(result);
  } catch (error) {
    console.log(error);

    return {
      statusCode: error.status || 500,
      error: "ooops",
    };
  }
};
