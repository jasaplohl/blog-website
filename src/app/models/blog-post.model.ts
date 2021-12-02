export class BlogPost {
    public blog_id: String;
    public user_id: String;
    public user_name: String;
    public blog_content: String;
    public image_id: String;
    public timestamp: string;

    public likes: String[];
    public dislikes: String[];
    public comments: any[];

    constructor(blog_id: String, user_id: String, user_name: String,  timestamp: string, 
                blog_content: String, image_id: String, likes: String[], dislikes: String[],
                comments: any[]) {
        this.blog_id = blog_id;
        this.user_id = user_id;
        this.user_name = user_name;
        this.timestamp = timestamp;
        this.blog_content = blog_content;
        this.image_id = image_id;
        this.likes = likes;
        this.dislikes = dislikes;
        this.comments = comments;
    }

    blogToJSON() {
        return {
            blog_id: this.blog_id,
            user_id: this.user_id,
            user_name: this.user_name,
            timestamp: this.timestamp,
            blog_content: this.blog_content,
            image_id: this.image_id,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments
        };
    }

    /**
     * Finds the differences between the blog post JSON and the model
     * and updates the model accordingly
     */
    updateBlogPost(response: any) {
        response = response[0];
        
        this.blog_content = response.blog_content;
        this.image_id = response.image_id;

        //Not good - the same user can be in the likes and dislikes now
        this.likes = [...new Set(this.likes.concat(response.likes))];
        this.dislikes = [...new Set(this.dislikes.concat(response.dislikes))];

        // this.comments.forEach(element => {
            
        // });

        // console.log(this.comments.map);

        console.log("Latest:");
        console.log(response);
        console.log("Our:");
        console.log(this.blogToJSON());
    }

}