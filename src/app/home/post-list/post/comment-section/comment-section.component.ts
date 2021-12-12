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

    const user = await Auth.currentAuthenticatedUser();
    const getRequestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      }
    };

    await Auth.currentUserInfo()
              .then(user_ => {
                //We create a new comment
                var newComment = new BlogComment(
                  this.blog_id, uuidv4(), user_.attributes.sub, user.username, new Date().toISOString(), 
                  commentPost.comment_content, [], [], []
                );

                API
                  .get('blog', '/blog/' + this.blog_id, getRequestInfo)
                  .then(response => {
                    if(response.length > 0) {
                      this.comments.push(newComment);
                      response[0].comments.push(newComment.commentToJSON());
                      const postRequestInfo = {
                        headers: {
                          Authorization: user.signInUserSession.idToken.jwtToken
                        },
                        body: response[0]
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
                      console.log("The post has already been deleted.");
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
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
