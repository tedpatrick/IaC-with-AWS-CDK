import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class EMPTY extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// CDK Constructs HERE

		

	}
}

const { AWS_ACCOUNT_ID, AWS_REGION } = process.env;

const app = new cdk.App();
new EMPTY(app, "empty", {
	stackName: "empty",
	env: {
		region: AWS_REGION,
		account: AWS_ACCOUNT_ID,
	},
});
