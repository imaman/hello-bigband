
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
