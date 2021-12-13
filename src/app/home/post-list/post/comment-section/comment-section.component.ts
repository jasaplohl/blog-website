import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { v4 as uuidv4 } from 'uuid';
import { Auth, API } from 'aws-amplify';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comments: BlogComment[];

  @Output() requestUpdateEvent = new EventEmitter<void>();

  public newCommentForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newCommentForm = fb.group({
      comment_content: ["", Validators.required]
    });
  }

  async ngOnInit() {}

  commentFromJSON(json: any) {
    return new BlogComment(json.blog_id, json.comment_id, json.user_id, json.user_name, json.timestamp, 
        json.comment_content, json.likes, json.dislikes, json.replies);
  }

  async createComment(commentPost: any) {
    this.newCommentForm.reset();

    await Auth.currentAuthenticatedUser()
        .then(response => {
          const getRequestInfo = {
            headers: {
              Authorization: response.signInUserSession.idToken.jwtToken
            }
          }
          //We create a new comment
          var newComment = new BlogComment(
            this.blog_id, uuidv4(), response.signInUserSession.idToken.payload.sub, response.username, new Date().toISOString(), 
            commentPost.comment_content, [], [], []
          );

          API
            .get('blogapi', '/blog/' + this.blog_id, getRequestInfo)
            .then(res => {
              if(res.length > 0) {
                this.comments.push(newComment);
                res[0].comments.push(newComment.commentToJSON());
                const postRequestInfo = {
                  headers: {
                    Authorization: response.signInUserSession.idToken.jwtToken
                  },
                  body: res[0]
                };
                API
                  .put('blogapi', '/blog', postRequestInfo)
                  .then(response => {
                    console.log(response);
                    this.onRequestUpdate();
                  })
                  .catch(error => {
                    console.error("Error: ", error);
                  });
              } else {
                //TODO error message
                console.error("The post has already been deleted.");
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

  onRequestUpdate() {
    this.requestUpdateEvent.emit();
  }

  // onCommentEvent(comment: BlogComment) {
  //   this.comments.forEach(element => {
  //     if(element.comment_id === comment.comment_id) {
  //       element = comment;
  //       console.log(true);
  //     } else {
  //       console.log(false);
  //     }
  //   });
  //   this.emitCommentEvent();
  // }
  
}
