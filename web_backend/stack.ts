import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigv2integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";

export class WEB_BACKEND extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// CDK Constructs HERE

		////////////////////////////////
		// HTTP API Gateway
		const wb_http_api = new apigv2.HttpApi(this, `wb-http-api`, {
			apiName: 'wb-http-api',
			createDefaultStage: true,
		});


		////////////////////////////////
		// Lambda
		const wb_api_lambda = new nodejs.NodejsFunction(this, "wb-api-lambda", {
			entry: 'src/backend/index.ts',
			handler: 'handler',
			architecture: lambda.Architecture.ARM_64,
			runtime: lambda.Runtime.NODEJS_22_X,
			memorySize: 1024,
			timeout: cdk.Duration.seconds(10),
			environment: {},
			logGroup: new logs.LogGroup(this, "wb-api-log-group", {
				logGroupName: `/wb-api`,
				retention: logs.RetentionDays.ONE_YEAR,
				removalPolicy: cdk.RemovalPolicy.RETAIN,
			}),
		});


		////////////////////////////////
		// HTTP API Gateway
		wb_http_api.addRoutes({
			path: "/{proxy+}",
			methods: [apigv2.HttpMethod.ANY],
			integration: new apigv2integrations.HttpLambdaIntegration('wb-http-api-integration', wb_api_lambda),
		});

		////////////////////////////////
		// Output
		new cdk.CfnOutput(this, "wb-http-api-url", {
			value: wb_http_api.url!,
			exportName: "wb-http-api-url",
		});


	}
}

const { AWS_ACCOUNT_ID, AWS_REGION } = process.env;

const app = new cdk.App();
new WEB_BACKEND(app, "web-backend", {
	stackName: "web-backend",
	env: {
		region: AWS_REGION,
		account: AWS_ACCOUNT_ID,
	},
});
