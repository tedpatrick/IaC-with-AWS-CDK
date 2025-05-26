import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as logs from "aws-cdk-lib/aws-logs";
import * as event_sources from "aws-cdk-lib/aws-lambda-event-sources";

export class EVENT_WORKERS extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// CDK Constructs HERE

		////////////////////////////////
		// Event Bus
		const ew_event_bus = new events.EventBus(this, "ew-event-bus", {
			eventBusName: "ew-event-bus",
		});


		////////////////////////////////
		// BOT Queues
		// dead letter queue
		const ew_bot_sqs_dlq = new sqs.Queue(this, "ew-bot-sqs-dlq", {
			queueName: "ew-bot-sqs-dlq",
			retentionPeriod: cdk.Duration.days(1),
		});
		// bot sqs queue
		const ew_bot_sqs = new sqs.Queue(this, "ew-bot-sqs", {
			queueName: "ew-bot-sqs",
			deadLetterQueue: {
				queue: ew_bot_sqs_dlq,
				maxReceiveCount: 1,
			},
		});

		////////////////////////////////
		// SQS Rule
		// routes eventbridge event into SQS queue
		new events.Rule(this, `ew-sqs-rule`, {
			eventBus: ew_event_bus,
			eventPattern: {
				source: ["ew"],
				detailType: [
					"ew.hello.brian",
					"ew.hello.cory",
					"ew.hello.ted",
				],
			},
			targets: [new targets.SqsQueue(ew_bot_sqs)],
		});

		////////////////////////////////
		// Code
		const app_code = lambda.Code.fromAsset(path.join(__dirname, 'src/sqs_worker'), {
			bundling: {
			  image: lambda.Runtime.PYTHON_3_13.bundlingImage,
			  command: [
				'bash', '-c',
				'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
			  ],
			},
		})
		
		////////////////////////////////
		// SQS Lambda Workers
		// bot sqs worker
		const ew_sqs_worker = new lambda.Function(this, "ew-sqs-worker", {
			runtime: lambda.Runtime.PYTHON_3_13,
			architecture: lambda.Architecture.ARM_64,
			code: app_code,
			handler: "index.handler",
			memorySize: 1024,
			timeout: cdk.Duration.seconds(10),
			logGroup: new logs.LogGroup(this, "ew-sqs-worker-log-group", {
				logGroupName: `/ew-sqs-worker`,
				retention: logs.RetentionDays.ONE_YEAR,
			}),
		});

		////////////////////////////////
		// SQS Event Source
		ew_sqs_worker.addEventSource(new event_sources.SqsEventSource(ew_bot_sqs));



		////////////////////////////////
		// Output
		new cdk.CfnOutput(this, "ew-event-bus-name", {
			value: ew_event_bus.eventBusName!,
			exportName: "ew-event-bus-name",
		});


	}
}

const { AWS_ACCOUNT_ID, AWS_REGION } = process.env;

const app = new cdk.App();
new EVENT_WORKERS(app, "event-workers", {
	stackName: "event-workers",
	env: {
		region: AWS_REGION,
		account: AWS_ACCOUNT_ID,
	},
});
