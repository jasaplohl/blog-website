import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, Auth } from 'aws-amplify';
import { BlogPost } from 'src/app/models/blog-post.model';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  @Input() declare blog: BlogPost;

  public newCommentForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newCommentForm = fb.group({
      comment_content: ["", Validators.required]
    });
  }

  ngOnInit(): void {}

  onCreate(commentPost: any): void {
    this.createComment(commentPost);
  }

  async createComment(commentPost: any) {
    const user = await Auth.currentAuthenticatedUser();

    const requestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      },
      body: {}
    };

    await Auth.currentUserInfo()
              .then(user_ => {
                this.blog.comments.push({ user_id: user_.attributes.sub, user_name: user.username, 
                                     timestamp: new Date().toISOString(), comment_content: commentPost.comment_content, 
                                     likes: [], dislikes: [] });
                requestInfo.body = this.blog.blogToJSON();
                console.log(this.blog.blogToJSON());
                console.log(this.blog);
                API
                  .post('blog', '/blog', requestInfo)
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.log("Error: ", error);
                  });
              });
  }

}
