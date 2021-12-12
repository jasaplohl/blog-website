import { Storage } from 'aws-amplify';
import { API, Auth } from 'aws-amplify';

export class BlogPost {
    public blog_id: String;
    public user_id: String;
    public user_name: String;
    public blog_content: String;
    public image_id: string;
    public timestamp: string;

    public likes: String[];
    public dislikes: String[];
    public comments: any[];

    public image!: any;

    constructor(blog_id: String, user_id: String, user_name: String,  timestamp: string, 
                blog_content: String, image_id: string, likes: String[], dislikes: String[],
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

    /**
     * Returns the blog data in a JSON format
     */
    blogToJSON() {
        return {
            blog_id: this.blog_id,
            user_id: this.user_id,
            user_name: this.user_name,
            timestamp: this.timestamp,
            blog_content: this.blog_content,
            image_id: this.image_id,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments
        };
    }

    updateFromJSON(response: any) {
        this.blog_content = response[0].blog_content;
        this.likes = response[0].likes;
        this.dislikes = response[0].dislikes;
        this.comments = response[0].comments;
    }

    async fetchLatestBlogData() {
      const user = await Auth.currentAuthenticatedUser();
      const getRequestInfo = {
        headers: {
          Authorization: user.signInUserSession.idToken.jwtToken
        }
      };

      // First we fetch the current blog, to update any changes from other users
      API
        .get('blogapi', '/blog/' + this.blog_id, getRequestInfo)
        .then(response => {
          console.log("Updating the blog");
          console.log(response);
          this.updateFromJSON(response);
        })
        .catch(error => {
          console.log(error);
        });
    }

    /**
     * Fetches the image for the blog from the S3 bucket
     */
    async getBlogImage() {
        if(this.image_id && this.image_id.trim() !== "") {
            Storage
                .get(this.image_id, {
                    level: "public"
                })
                .then(res => {
                    this.image = res;
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    async likePost() {
        const user = await Auth.currentAuthenticatedUser();

        const getRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          }
        };

        // First we fetch the current blog, to update any changes from other users
        API
          .get('blogapi', '/blog/' + this.blog_id, getRequestInfo)
          .then(response => {
            //We update the blog with the new content
            this.updateFromJSON(response);
            console.log(response);
            if(!this.likes.includes(user.username)) {
                var index = this.dislikes.indexOf(user.username)
                if(index > -1) {
                    this.dislikes.splice(index, 1);
                }
                this.likes.push(user.username);
            } else {
                var index = this.likes.indexOf(user.username)
                if(index > -1) {
                    this.likes.splice(index, 1);
                }
            }
            // Then we upload the changes
            const postRequestInfo = {
                headers: {
                  Authorization: user.signInUserSession.idToken.jwtToken
                },
                body: this.blogToJSON() 
            };
            API
              .put('blogapi', '/blog', postRequestInfo)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.error("Error: ", error);
              });
          })
          .catch(error => {
            console.error(error);
          });
    }

    async dislikePost() {
        const user = await Auth.currentAuthenticatedUser();
        console.log(user);
        const getRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          }
        };

        // First we fetch the current blog, to update any changes from other users
        API
          .get('blogapi', '/blog/' + this.blog_id, getRequestInfo)
          .then(response => {
            //We update the blog with the new content
            this.updateFromJSON(response);

            if(!this.dislikes.includes(user.username)) {
                var index = this.likes.indexOf(user.username)
                if(index > -1) {
                    this.likes.splice(index, 1);
                }
                this.dislikes.push(user.username);
            } else {
                var index = this.dislikes.indexOf(user.username)
                if(index > -1) {
                    this.dislikes.splice(index, 1);
                }
            }
            // Then we upload the changes
            const postRequestInfo = {
                headers: {
                  Authorization: user.signInUserSession.idToken.jwtToken
                },
                body: this.blogToJSON() 
            };
            API
              .put('blogapi', '/blog', postRequestInfo)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.error("Error: ", error);
              });
          })
          .catch(error => {
            console.error(error);
          });
    }

    async updatePostContent(newContent: String) {
        const user = await Auth.currentAuthenticatedUser();

        const getRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          }
        };
    
        // First we fetch the current blog, to update any changes from other users
        API
          .get('blogapi', '/blog/' + this.blog_id, getRequestInfo)
          .then(response => {
            //We update the blog with the new content
            this.updateFromJSON(response);
            this.blog_content = newContent;

            // Then we upload the changes
            const postRequestInfo = {
              headers: {
                Authorization: user.signInUserSession.idToken.jwtToken
              },
              body: this.blogToJSON() 
            };
            API
              .put('blogapi', '/blog', postRequestInfo)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.error("Error: ", error);
              });
          })
          .catch(error => {
            console.error(error);
          });
    }

}