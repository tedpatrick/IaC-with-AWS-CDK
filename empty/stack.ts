import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export class EMPTY extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// CDK Constructs HERE

		// s3
		const s3_bucket = new s3.Bucket(this, "bew-empty-bucket", {
			bucketName: "bew-empty-bucket",
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});
		

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
