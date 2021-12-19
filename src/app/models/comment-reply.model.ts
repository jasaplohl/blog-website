import { API, Auth } from 'aws-amplify';

export class CommentReply {
    public blog_id: String;
    public comment_id: String;
    public reply_id: String;
    
    public user_id: String;
    public user_name: String;
    public reply_content: String;
    public timestamp: string;
    public likes: String[];
    public dislikes: String[];

    constructor(blog_id: String, comment_id: String, reply_id: String, user_id: String, user_name: String, timestamp: string, 
                reply_content: String, likes: String[], dislikes: String[]) {
        this.blog_id = blog_id;
        this.comment_id = comment_id;
        this.reply_id = reply_id;

        this.user_id = user_id;
        this.user_name = user_name;
        this.timestamp = timestamp;
        this.reply_content = reply_content;
        this.likes = likes;
        this.dislikes = dislikes;
    }

    async likeReply() {
        const requestInfo = {
            headers: {
              Authorization: undefined
            },
            body: undefined
        };
        var username: String = undefined!;

        await Auth.currentAuthenticatedUser()
            .then(response => {
                requestInfo.headers.Authorization = response.signInUserSession.idToken.jwtToken;
                username = response.username;
            })
            .catch(error => {
                console.error(error);
            });
        
        if(requestInfo.headers.Authorization) {
            // First we fetch the current blog, to update any changes from other users
            await API
              .get('blogapi', '/blog/' + this.blog_id, requestInfo)
              .then(res => {
                console.log(res);
                if(res.blog_id) {
                    res = this.likeReplyFromJson(res, username);
                    // Then we upload the changes
                    requestInfo.body = res;
                } else {
                    console.error("The post has already been deleted");
                }
              })
              .catch(error => {
                console.error(error);
              });

              if(requestInfo.body) {
                await API
                  .put('blogapi', '/blog', requestInfo)
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.error("Error: ", error);
                  });
              }
        }
    }

    likeReplyFromJson(response: any, currentUser: String) {
        for(var i=0; i<response.comments.length; i++) {
            if(response.comments[i].comment_id === this.comment_id) {
                //We have found the correct comment
                for(var j=0; j<response.comments[i].replies.length; j++) {
                    if(response.comments[i].replies[j].reply_id === this.reply_id) {
                        //We have found the correct reply
                        if(!response.comments[i].replies[j].likes.includes(currentUser)) {
                            var index = response.comments[i].replies[j].dislikes.indexOf(currentUser);
                            if(index > -1) {
                                response.comments[i].replies[j].dislikes.splice(index, 1);
                            }
                            response.comments[i].replies[j].likes.push(currentUser);
                        } else {
                            var index = response.comments[i].replies[j].likes.indexOf(currentUser);
                            if(index > -1) {
                                response.comments[i].replies[j].likes.splice(index, 1);
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        return response;
    }

    async dislikeReply() {
        const requestInfo = {
            headers: {
              Authorization: undefined
            },
            body: undefined
        };
        var username: String = undefined!;

        await Auth.currentAuthenticatedUser()
            .then(response => {
                requestInfo.headers.Authorization = response.signInUserSession.idToken.jwtToken;
                username = response.username;
            })
            .catch(error => {
                console.error(error);
            });
        
        if(requestInfo.headers.Authorization) {
            // First we fetch the current blog, to update any changes from other users
            await API
              .get('blogapi', '/blog/' + this.blog_id, requestInfo)
              .then(res => {
                console.log(res);
                if(res.blog_id) {
                    res = this.dislikeReplyFromJson(res, username);
                    // Then we upload the changes
                    requestInfo.body = res;
                } else {
                    console.error("The post has already been deleted");
                }
              })
              .catch(error => {
                console.error(error);
              });

              if(requestInfo.body) {
                await API
                  .put('blogapi', '/blog', requestInfo)
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.error("Error: ", error);
                  });
              }
        }
    }
    
    dislikeReplyFromJson(response: any, currentUser: String) {
        for(var i=0; i<response.comments.length; i++) {
            if(response.comments[i].comment_id === this.comment_id) {
                //We have found the correct comment
                for(var j=0; j<response.comments[i].replies.length; j++) {
                    if(response.comments[i].replies[j].reply_id === this.reply_id) {
                        //We have found the correct reply
                        if(!response.comments[i].replies[j].dislikes.includes(currentUser)) {
                            var index = response.comments[i].replies[j].likes.indexOf(currentUser);
                            if(index > -1) {
                                response.comments[i].replies[j].likes.splice(index, 1);
                            }
                            response.comments[i].replies[j].dislikes.push(currentUser);
                        } else {
                            var index = response.comments[i].replies[j].dislikes.indexOf(currentUser);
                            if(index > -1) {
                                response.comments[i].replies[j].dislikes.splice(index, 1);
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        return response;
      }

    async editReply(newContent: String) {
        const requestInfo = {
            headers: {
              Authorization: undefined
            },
            body: undefined
          };
    
          var username: String = undefined!;
    
          await Auth.currentAuthenticatedUser()
            .then(response => {
              requestInfo.headers.Authorization = response.signInUserSession.idToken.jwtToken;
              username = response.username;
            })
            .catch(error => {
              console.error(error);
            });
    
          if(requestInfo.headers.Authorization) {
            // First we fetch the current blog, to update any changes from other users
            await API
              .get('blogapi', '/blog/' + this.blog_id, requestInfo)
              .then(res => {
                if(res.blog_id) {
                  //We update the comment with the new content
                  for(var i=0; i<res.comments.length; i++) {
                    if(res.comments[i].comment_id === this.comment_id) {
                        for(var j=0; j<res.comments[i].replies.length; j++) {
                            if(res.comments[i].replies[j].reply_id === this.reply_id) {
                                res.comments[i].replies[j].reply_content = newContent;
                                break;
                            }
                        }
                    }
                  }
                  this.reply_content = newContent;
    
                  // Then we upload the changes
                  requestInfo.body = res;
                }
              })
              .catch(error => {
                console.error(error);
              });
              if(requestInfo.body) {
                await API
                  .put('blogapi', '/blog', requestInfo)
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.error("Error: ", error);
                  });
              }
          }
    }
}