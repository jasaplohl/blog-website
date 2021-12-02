export class BlogComment {
    public blog_id: String;
    public comment_id: String;

    public user_id: String;
    public user_name: String;
    public comment_content: String;
    public timestamp: string;
    public likes: String[];
    public dislikes: String[];
    public replies: any[];

    constructor(blog_id: String, comment_id: String, user_id: String, user_name: String, timestamp: string, 
                comment_content: String, likes: String[], dislikes: String[], replies: any[]) {
        this.blog_id = blog_id;
        this.comment_id = comment_id;
        
        this.user_id = user_id;
        this.user_name = user_name;
        this.timestamp = timestamp;
        this.comment_content = comment_content;
        this.likes = likes;
        this.dislikes = dislikes;
        this.replies = replies;
    }
}