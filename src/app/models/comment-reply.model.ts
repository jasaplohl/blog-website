export class CommentReply {
    public reply_id: String;
    public user_id: String;
    public user_name: String;
    public reply_content: String;
    public timestamp: string;
    public likes: String[];
    public dislikes: String[];

    constructor(reply_id: String, user_id: String, user_name: String, timestamp: string, 
                reply_content: String, likes: String[], dislikes: String[]) {
        this.reply_id = reply_id;
        this.user_id = user_id;
        this.user_name = user_name;
        this.timestamp = timestamp;
        this.reply_content = reply_content;
        this.likes = likes;
        this.dislikes = dislikes;
    }
}