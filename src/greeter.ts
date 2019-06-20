
export async function runLambda(context, event, mapping) {
    return {
        greeting: `The name is ${event.lastName}, ${event.firstName} ${event.lastName}`
    };
}
