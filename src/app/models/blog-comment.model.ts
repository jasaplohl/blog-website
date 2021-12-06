import { API, Auth } from 'aws-amplify';

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

    /**
     * Returns the blog data in a JSON format
     */
     commentToJSON() {
        return {
            blog_id: this.blog_id,
            comment_id: this.comment_id,
            user_id: this.user_id,
            user_name: this.user_name,
            comment_content: this.comment_content,
            timestamp: this.timestamp,
            likes: this.likes,
            dislikes: this.dislikes,
            replies: this.replies,
        };
    }

    async likeComment() {
        const user = await Auth.currentAuthenticatedUser();

        const getRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          }
        };

        // First we fetch the current blog, to update any changes from other users
        API
          .get('blog', '/blog/' + this.blog_id, getRequestInfo)
          .then(response => {
            if(response.length > 0) {
                response = this.likeCommentFromJson(response[0], user.username);
                // Then we upload the changes
                const postRequestInfo = {
                    headers: {
                      Authorization: user.signInUserSession.idToken.jwtToken
                    },
                    body: response
                };
                API
                  .put('blog', '/blog', postRequestInfo)
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.error("Error: ", error);
                  });
            } else {
                //TODO error message
                console.log("The post has already been deleted");
            }
          })
          .catch(error => {
            console.error(error);
          });
    }

    likeCommentFromJson(response: any, currentUser: String): any {
        for(var i=0; i<response.comments.length; i++) {
            if(response.comments[i].comment_id === this.comment_id) {
                if(!response.comments[i].likes.includes(currentUser)) {
                    var index = response.comments[i].dislikes.indexOf(currentUser)
                    if(index > -1) {
                        response.comments[i].dislikes.splice(index, 1);
                    }
                    response.comments[i].likes.push(currentUser);
                } else {
                    var index = response.comments[i].likes.indexOf(currentUser)
                    if(index > -1) {
                        response.comments[i].likes.splice(index, 1);
                    }
                }
            }
        }
        return response;
    }

    async dislikeComment() {
        const user = await Auth.currentAuthenticatedUser();

        const getRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          }
        };

        // First we fetch the current blog, to update any changes from other users
        API
          .get('blog', '/blog/' + this.blog_id, getRequestInfo)
          .then(response => {
            if(response.length > 0) {
                response = this.dislikeCommentFromJson(response[0], user.username);
                // Then we upload the changes
                const postRequestInfo = {
                    headers: {
                      Authorization: user.signInUserSession.idToken.jwtToken
                    },
                    body: response
                };
                API
                  .put('blog', '/blog', postRequestInfo)
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.error("Error: ", error);
                  });
            } else {
                //TODO error message
                console.log("The post has already been deleted");
            }
          })
          .catch(error => {
            console.error(error);
          });
    }

    dislikeCommentFromJson(response: any, currentUser: String): any {
        for(var i=0; i<response.comments.length; i++) {
            if(response.comments[i].comment_id === this.comment_id) {
                if(!response.comments[i].dislikes.includes(currentUser)) {
                    var index = response.comments[i].likes.indexOf(currentUser)
                    if(index > -1) {
                        response.comments[i].likes.splice(index, 1);
                    }
                    response.comments[i].dislikes.push(currentUser);
                } else {
                    var index = response.comments[i].dislikes.indexOf(currentUser)
                    if(index > -1) {
                        response.comments[i].dislikes.splice(index, 1);
                    }
                }
            }
        }
        return response;
    }

    async updateComment() {

    }

}