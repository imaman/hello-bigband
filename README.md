# hello-bigband!



## Prerequisites

- setup an AWS profile on your local machine ([instructions](https://docs.aws.amazon.com/cli/latestn/userguide/cli-configure-profiles.html))
- npx (optional: if you don't want to use `npx` you can run `bigband` directly via `node_modules/.bin/bigband`)


## Install

```bash
npm install --save-dev bigband
```

## Prepare an s3 bucket
Bigband uses an s3 for pushing data/code into the AWS cloud. You can either use a pre-existing s3 bucket (all Bigband writes take place under a key-prefix which you control) or you can create a new bucket.

If you choose the latter use the following command:
```bash
aws s3 mb <name-of-your-bucket>
```

## Define your bigband
Add a `bigband.config.ts` file, as shown below. Don't forget to adjust the values of `AWS_ACCOUNT`, `S3_PREFIX`, and `PROFILE_NAME` variables.

```typescript
import { LambdaInstrument, IsolationScope, Section } from 'bigband-core/lib/index';


const AWS_ACCOUNT = '<YOUR-AWS-ACCOUNT-ID>';
const S3_PREFIX = '<A-STRING-OF-YOUR-CHOICE>';
const PROFILE_NAME = '<NAME-OF-AN-AWS-PROFILE-DEFINED-ON-YOUR-MACHINE>';

const namespace = new IsolationScope(AWS_ACCOUNT, 'hello-bigband', S3_PREFIX, 'hello-bigband-root', PROFILE_NAME);
const prod = new Section(namespace, 'eu-west-2', 'prod');

const greeter = new LambdaInstrument('misc', 'greeter', 'src/greeter', {
    Description: "plain old greeter",
    MemorySize: 1024,
    Timeout: 15   
});


export function run() {
    return {
        sections: [prod],
        instruments: [greeter]
    }
}
```

## Implement a greeter function
Add an `src/greeter.ts` file, as follows:

```typescript
export async function runLambda(context, event, mapping) {
    return {
        greeting: `The name is ${event.lastName}, ${event.firstName} ${event.lastName}`
    };
}
```

This function expects to receive an input with two string fields `lastName`, `firstName`. It generates an output which is an object with a single field, `greeting`.



## Time to ship
We deploy by using Bigband's `ship` command. This will setup everything in the AWS cloud as needed. It takes no arguments so your command should look as follows:

```bash
npx bigband ship
```

Once you run it deployment will begin. First-time deployments usually take on the order of 60-90s to complete (as all necessary AWS resources need to be created, via `cloudformation`). Subsequent deployments should be much faster. Here's a full transcript of the `ship` command:

```
$ npx bigband ship
Shipping section "prod" to eu-west-2
Compiling misc-greeter
Compiling bigband-system-teleport
Non-teleporting deployment (0.541MB) of bigband-system-teleport
Non-teleporting deployment (0.002MB) of misc-greeter
Creating change set
.
..
Enacting Change set
.
..
...
Stack status: CREATE_COMPLETE
Section "prod" shipped in 75.5s
```


Important: `bigband ship` is the one-and-only command used for deplyoing bigbands. You use it for first-time deployments (as you just did) but also for every subsequent update. It ships code changes (e.g., changes to `src/greeter.ts`) as well as architecutral changes (e.g., changes to `bigband.config.ts` file). Behaind the scenes, Bigband makes sure that the deployment is minimal: only things that were actully changed will be redeployed. Specifically, if you have multiple lambda instruments defined in your bigband and you have changed just a few them, then running `bigband ship` will only *update the lambdas that were changed*.

Bottom line: freely run `bigband ship` whenever you need to deploy.



## Let's greet
Bigband's `invoke` command send a payload of your choice to a lambda instrument. The general format is as follows:

```bash
npx bigband invoke --function-name <name-of-a-lambda-instrument> --input <JSON>
```

In this tutorial, the function name is `greeter` and the input JSON is an object with two fields (`firstName`, `lastName`):

```
$ npx bigband invoke --function-name greeter --input '{"firstName": "James", "lastName": "Bond"}'
{
  "StatusCode": 200,
  "LogResult": [
    "START RequestId: 3c2d1393-9348-4630-8c64-19d7c761a6db Version: $LATEST",
    "END RequestId: 3c2d1393-9348-4630-8c64-19d7c761a6db",
    "REPORT RequestId: 3c2d1393-9348-4630-8c64-19d7c761a6db\tDuration: 2.50 ms\tBilled Duration: 100 ms \tMemory Size: 1024 MB\tMax Memory Used: 57 MB\t",
    ""
  ],
  "ExecutedVersion": "$LATEST",
  "Payload": {
    "greeting": "The name is Bond, James Bond"
  }
}
```


## Congratulations!
Your first bigband is up-and-playing.

