import { LambdaInstrument, IsolationScope, Section } from 'bigband-core/lib/index';


const namespace = IsolationScope.create({
    awsAccount: '196625562809',
    profileName: 'imaman',
    s3Bucket: 'bigband-example',
    s3Prefix: 'hello-bigband-root',
    scopeName: 'hello-bigband'});
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
