import { BlogComment } from "./blog-comment.model";

export class BlogPost {
    public blog_id: String;
    public user_id: String;
    public blog_content: String;
    public image_id: String;

    public likes: String[];
    public dislikes: String[];

    public comments: BlogComment[];

    constructor(blog_id: String, user_id: String, blog_content: String,
                image_id: String, likes: String[], dislikes: String[],
                comments: BlogComment[]) {
        this.blog_id = blog_id;
        this.user_id = user_id;
        this.blog_content = blog_content;
        this.image_id = image_id;
        this.likes = likes;
        this.dislikes = dislikes;
        this.comments = comments;
    }
}