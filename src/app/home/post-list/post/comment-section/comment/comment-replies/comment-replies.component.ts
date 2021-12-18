import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { v4 as uuidv4 } from 'uuid';
import { Auth, API } from 'aws-amplify';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment_id: String;
  @Input() declare replies: CommentReply[];
  
  @Output() requestUpdateEvent = new EventEmitter<void>();

  currentUser!: String;
  public newReplyForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newReplyForm = fb.group({
      reply_content: ["", Validators.required]
    });
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
      .then(response => {
        this.currentUser = response.username;
      })
      .catch(error => {
        console.error(error);
      });
  }

  replyFromJSON(json: any) {
    return new CommentReply(json.blog_id, json.comment_id, json.reply_id, json.user_id, json.user_name, json.timestamp, 
      json.reply_content, json.likes, json.dislikes);
  }

  async createReply(commentReply: any) {
    this.newReplyForm.reset();

    Auth.currentAuthenticatedUser()
      .then(response => {
        const requestInfo = {
          headers: {
            Authorization: response.signInUserSession.idToken.jwtToken
          },
          body: undefined
        }
        var newReply = new CommentReply(
          this.blog_id, this.comment_id, uuidv4(), response.signInUserSession.idToken.payload.sub, response.username, 
          new Date().toISOString(), commentReply.reply_content, [], []
        );

        API
          .get('blogapi', '/blog/' + this.blog_id, requestInfo)
          .then(res => {
            if(res.blog_id) {
              var reply = false;
              for(var i=0; i<res.comments.length; i++) {
                if(res.comments[i].comment_id === this.comment_id) {
                  reply = true;
                  res.comments[i].replies.push(newReply);
                  break;
                }
              }
              console.log(reply ? "The comment exists" : "The comment no longer exists");
              requestInfo.body = res;
              API
                .put('blogapi', '/blog', requestInfo)
                .then(response => {
                  console.log(response);
                  this.onRequestUpdate();
                })
                .catch(error => {
                  console.error("Error: ", error);
                });
            } else {
              console.error("The post has already been deleted.");
              window.location.reload();
            }
          })
          .catch();
      })
      .catch(error => {
        console.warn(error);
      });
  }

  onRequestUpdate() {
    this.requestUpdateEvent.emit();
  }

}
