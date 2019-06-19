# hello-bigband!



## Prerequisites

- npx
- tsc


## Install

```bash
npm install --save-dev bigband
```

## Define your bigband
Add a `bigband.config.ts` file, as follows:

```typescript
import { LambdaInstrument, IsolationScope, Section } from 'bigband-core/lib/index';


const namespace = new IsolationScope('196625562809', 'hello-bigband', 'bigband-example', 'hello-bigband-root', 'imaman');
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


## Create a source directory
```bash
mkdir src
```

## Create greeter.ts
Add a `src/greeter.ts` file, as follows:

```typescript

export async function runLambda(context, event, mapping) {
    const q = event.firstName;
    return {
        statusCode: 200,
        headers: { 
          "content-type": 'application/json', 
        },
        body: {
            message: `Your name is ${event.lastName}, ${event.firstName} ${event.lastName}`
        }
    };
}
```


## Time to ship
```bash
npx bigband ship
```


## Let's greet
```bash
npx bigband invoke --function-name greeter --input '{"firstName": "James", "lastName": "Bond"}'
```

