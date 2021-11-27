

exports.handler = async (event) => {
    console.log(event);
    const body = {
        message: "This is my first post!"
    };
    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
