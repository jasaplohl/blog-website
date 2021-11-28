export class CommentReply {
    public comment_id: String;
    public comment_content: String;
    public likes: String[];
    public dislikes: String[];

    constructor(comment_id: String, comment_content: String, 
                likes: String[], dislikes: String[]) {
        this.comment_id = comment_id;
        this.comment_content = comment_content;
        this.likes = likes;
        this.dislikes = dislikes;
    }
}