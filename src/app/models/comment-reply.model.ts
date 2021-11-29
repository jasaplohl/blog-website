export class CommentReply {
    public timestamp: Date;
    public comment_content: String;
    public likes: String[];
    public dislikes: String[];

    constructor(timestamp: Date, comment_content: String, 
                likes: String[], dislikes: String[]) {
        this.timestamp = timestamp;
        this.comment_content = comment_content;
        this.likes = likes;
        this.dislikes = dislikes;
    }
}