import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { BlogPost } from 'src/app/models/blog-post.model';
import { API, Auth } from 'aws-amplify';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() declare blog: BlogPost;

  currentUser!: String;
  showCommentSection: boolean;
  commentCount!: number;

  constructor() { 
    this.showCommentSection = false;
  }

  toggleCommentSection() {
    this.showCommentSection = !this.showCommentSection;
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
              .then(usr => {
                this.currentUser = usr.username;
              });
    this.commentCount = this.blog.comments.length;
    this.blog.comments.forEach(element => {
      this.commentCount += element.replies.length;
    });
  }

  onCommentsEvent(comments: BlogComment[]) {
    this.blog.comments = comments;
    this.uploadData();
  }

  likePost() {
    if(!this.blog.likes.includes(this.currentUser)) {
      var index = this.blog.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.dislikes.splice(index, 1);
      }
      this.blog.likes.push(this.currentUser);
    } else {
      var index = this.blog.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.likes.splice(index, 1);
      }
    }
    this.uploadData();
  }

  dislikePost() {
    if(!this.blog.dislikes.includes(this.currentUser)) {
      var index = this.blog.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.likes.splice(index, 1);
      }
      this.blog.dislikes.push(this.currentUser);
    } else {
      var index = this.blog.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.dislikes.splice(index, 1);
      }
    }
    this.uploadData();
  }

  /**
   * Uploades the updated post to the DB
   */
   async uploadData() {
    const user = await Auth.currentAuthenticatedUser();

    const getRequestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      }
    };

    // First we fetch the current blog, to see if there have been any changes
    API
      .get('blog', '/blog/' + this.blog.blog_id, getRequestInfo)
      .then(response => {
        this.blog.updateBlogPost(response);
        // Then we upload the changes to the current blog
        const postRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          },
          body: this.blog.blogToJSON() 
        };
        API
          .put('blog', '/blog', postRequestInfo)
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
