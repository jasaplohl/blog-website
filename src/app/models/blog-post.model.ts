import { BlogComment } from "./blog-comment.model";

export class BlogPost {
    public blog_id: String;
    public user_id: String;
    public user_name: String;
    public timestamp: Date;
    public blog_content: String;
    public image_id: String;

    public likes: String[];
    public dislikes: String[];

    public comments: any[];

    constructor(blog_id: String, user_id: String, user_name: String,  timestamp: Date, 
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
            timestamp: this.timestamp.toISOString(),
            blog_content: this.blog_content,
            image_id: this.image_id,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments
        };
    }
}