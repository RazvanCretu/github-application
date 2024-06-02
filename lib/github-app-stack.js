import { Stack, Duration, RemovalPolicy } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import {
  ManagedPolicy,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import {
  Runtime,
  LayerVersion,
  Architecture,
  Code,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { readdirSync } from "fs";

class GithubAppStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const serviceRole = new Role(this, `IAMRoleForLambdaFunction`, {
      roleName: `IAMRoleForLambdaFunction`,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      inlinePolicies: {
        inlinePolicies: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "secretsmanager:GetSecretValue",
              Resource: ["*"],
            },
            {
              Effect: "Allow",
              Action: "lambda:InvokeFunction",
              Resource: ["*"],
            },
          ],
        }),
      },
    });

    const layer = new LayerVersion(this, "CommonLayer", {
      compatibleArchitectures: [Architecture.X86_64],
      code: Code.fromAsset("/home/ubuntu/projects/github-app/private-key.zip"),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const eventHandler = new NodejsFunction(this, "WebhookHandler", {
      runtime: Runtime.NODEJS_20_X,
      entry: "lib/lambdas/handler.js",
      timeout: Duration.seconds(10),
      role: serviceRole,
      layers: [layer],
    });

    const events = readdirSync("lib/lambdas", { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    events.map(
      (e) =>
        new NodejsFunction(this, `gh-event-handler-${e}`, {
          functionName: e,
          runtime: Runtime.NODEJS_20_X,
          entry: `lib/lambdas/${e}/handler.js`,
          timeout: Duration.seconds(10),
          role: serviceRole,
          layers: [layer],
        })
    );

    const integration = new LambdaIntegration(eventHandler);

    const api = new RestApi(this, "API", {
      restApiName: "API",
      description: "API",
    });

    api.root.addMethod("POST", integration);
  }
}

export default GithubAppStack;
