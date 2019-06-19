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
