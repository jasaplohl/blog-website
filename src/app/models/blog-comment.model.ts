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

    updateFromJSON(response: any) {
      this.comment_content = response.comment_content;
      this.likes = response.likes;
      this.dislikes = response.dislikes;
      this.replies = response.replies;
    }

    async likeComment() {
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
                res = this.likeCommentFromJson(res, username);
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
                break;
            }
        }
        return response;
    }

    async dislikeComment() {
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
                res = this.dislikeCommentFromJson(res, username);
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
                break;
            }
        }
        return response;
    }

    async editComment(newContent: String) {
      const getRequestInfo = {
        headers: {
          Authorization: undefined
        }
      };

      //TODO : CHANGE THE FORM, SO THAT THE AWAITS DONT NEST

      await Auth.currentAuthenticatedUser()
        .then(response => {
          getRequestInfo.headers.Authorization = response.signInUserSession.idToken.jwtToken;

          // First we fetch the current blog, to update any changes from other users
          API
          .get('blogapi', '/blog/' + this.blog_id, getRequestInfo)
          .then(res => {
            if(res.blog_id) {
              //We update the comment with the new content
              for(var i=0; i<res.comments.length; i++) {
                if(res.comments[i].comment_id === this.comment_id) {
                  // this.updateFromJSON(res.comments[i]);
                  res.comments[i].comment_content = newContent;
                  break;
                }
              }
              this.comment_content = newContent;

              // Then we upload the changes
              const postRequestInfo = {
                headers: {
                  Authorization: response.signInUserSession.idToken.jwtToken
                },
                body: res 
              };
              API
                .put('blogapi', '/blog', postRequestInfo)
                .then(response => {
                  console.log(response);
                })
                .catch(error => {
                  console.error("Error: ", error);
                });
            }
          })
          .catch(error => {
            console.error(error);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

}