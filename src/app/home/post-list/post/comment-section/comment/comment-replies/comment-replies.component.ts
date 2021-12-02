import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.css']
})
export class CommentRepliesComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment_id: String;
  @Input() declare replies: CommentReply[];
  
  /**
   * Called when:
   * - a new reply has been created
   * - an existing reply has been updated
   * - a user liked or disliked the reply
   */
  @Output() repliesEvent = new EventEmitter<CommentReply[]>();

  public newReplyForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newReplyForm = fb.group({
      reply_content: ["", Validators.required]
    });
  }

  ngOnInit(): void {}

  onCreateReply(commentReply: any): void {
    this.newReplyForm.reset();
    this.createReply(commentReply);
  }

  async createReply(commentReply: any) {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.currentUserInfo()
              .then(user_ => {
                //We create a new reply
                var newReply = new CommentReply(
                  this.blog_id, this.comment_id, uuidv4(), user_.attributes.sub, user.username, 
                  new Date().toISOString(), commentReply.reply_content, [], []
                );
                //If the list is still empty
                if(this.replies === undefined) {
                  this.replies = []
                }
                this.replies.push(newReply); //We add the reply to the existing list
                this.emitRepliesEvent();
              });
  }

  onUpdateReply(commentReply: CommentReply) {
      //TODO: UPDATE THE REPLY
      this.emitRepliesEvent();
  }

  /**
   * Emits the replies to the parent component.
   */
  emitRepliesEvent() {
    this.repliesEvent.emit(this.replies);
  }

}
