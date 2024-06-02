import { SecretsManager } from "@aws-sdk/client-secrets-manager";

export const getSecretString = async (secretId) => {
  const client = new SecretsManager({});
  const getSecretValueCommandInput = {
    SecretId: secretId,
  };
  const secretString = (await client.getSecretValue(getSecretValueCommandInput))
    .SecretString;

  if (secretString) return secretString;
  else throw new Error("Couldn't get secret binary" + secretId);
};
