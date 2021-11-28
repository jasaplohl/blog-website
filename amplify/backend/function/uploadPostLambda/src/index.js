exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: event.body,
        headers: {
            "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Headers": "*"
        }, 
    };
    return response;
};
