exports.handler = async (event) => {
    const body = {
        blogs: [
            {
                blog_id: "1",
                user_id: "1",
                blog_content: "This is my first blog post. Hello world!",
                blog_image: false
            },
            {
                blog_id: "2",
                user_id: "2",
                blog_content: "This is a blog post from a different user.",
                blog_image: true
            }
        ]
    };
    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Headers": "*"
        }, 
    };
    return response;
};
