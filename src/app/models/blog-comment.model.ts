import { CommentReply } from "./comment-reply.model";

export class BlogComment {
    public timestamp: Date;
    public comment_content: String;
    public likes: String[];
    public dislikes: String[];
    public replies: CommentReply[];

    constructor(timestamp: Date, comment_content: String, 
                likes: String[], dislikes: String[], replies: CommentReply[]) {
        this.timestamp = timestamp;
        this.comment_content = comment_content;
        this.likes = likes;
        this.dislikes = dislikes;
        this.replies = replies;
    }
}