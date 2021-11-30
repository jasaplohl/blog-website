import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent implements OnInit {
  @Input() declare reply: CommentReply;

  currentUser!: String;

  /**
   * Called when:
   * - a reply has been updated
   * - a user liked or disliked the reply
   */
   @Output() replyEvent = new EventEmitter<CommentReply>();

  constructor() { }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
    .then(usr => {
      this.currentUser = usr.username;
    });
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

  onUpdateReply() {
    //TODO: UPDATE REPLY
    this.emitReplyEvent();
  }

  /**
   * Emits the reply data to the parent component.
   */
   emitReplyEvent() {
    this.replyEvent.emit(this.reply);
  }

  likeReply() {
    if(!this.reply.likes.includes(this.currentUser)) {
      var index = this.reply.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.reply.dislikes.splice(index, 1);
      }
      this.reply.likes.push(this.currentUser);
    } else {
      var index = this.reply.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.reply.likes.splice(index, 1);
      }
    }
    this.emitReplyEvent()
  }

  dislikeReply() {
    if(!this.reply.dislikes.includes(this.currentUser)) {
      var index = this.reply.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.reply.likes.splice(index, 1);
      }
      this.reply.dislikes.push(this.currentUser);
    } else {
      var index = this.reply.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.reply.dislikes.splice(index, 1);
      }
    }
    this.emitReplyEvent()
  }

}
