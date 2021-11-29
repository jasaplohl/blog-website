import { Component, OnInit, Input } from '@angular/core';
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

  showCommentSection: boolean;

  constructor() { 
    this.showCommentSection = false;
  }

  toggleCommentSection() {
    this.showCommentSection = !this.showCommentSection;
  }

  ngOnInit(): void {
  }

  onCommentsEvent(comments: BlogComment[]) {
    //TODO: UPDATE THE BLOGS COMMENTS
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

    console.log(this.blog);
     
    API
      .post('blog', '/blog', requestInfo)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

}
