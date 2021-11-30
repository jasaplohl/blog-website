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
  @Output() refreshEvent = new EventEmitter<Boolean>();

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
    console.log(comments);
    this.blog.comments = comments;
    this.uploadData();
  }

  /**
   * Uploades the updated post to the DB
   */
  async uploadData() {
    const user = await Auth.currentAuthenticatedUser();

    const requestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      },
      body: this.blog.blogToJSON()
    };
     
    API
      .post('blog', '/blog', requestInfo)
      .then(response => {
        console.log(response);
        this.requestRefresh();
      })
      .catch(error => {
        console.log("Error: ", error);
        this.requestRefresh();
      });
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
   * Emits the comments to the parent component.
   */
   requestRefresh() {
    this.refreshEvent.emit(true);
  }

}
