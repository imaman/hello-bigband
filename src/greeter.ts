
export async function runLambda(context, event, mapping) {
    const q = event.firstName;
    return {
        greeting: `Your name is ${event.lastName}, ${event.firstName} ${event.lastName}`
    };
}
