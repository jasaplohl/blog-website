import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { Auth, API } from 'aws-amplify';
import * as moment from 'moment';

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment_id: String;
  @Input() declare reply: CommentReply;

  currentUser!: String;
  timeFormat!: String;

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
      })
      .catch(error => {
        console.error(error);
      });
      
    this.timeFormat = moment(new Date(this.reply.timestamp)).fromNow();
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

  onUpdateReply() {
    //TODO: UPDATE REPLY
    this.emitReplyEvent();
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

  /**
   * Emits the event to the parent.
   */
  async emitReplyEvent() {
    const user = await Auth.currentAuthenticatedUser();

    const requestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      }
    };

    //First we check if the post is still available.
    API
      .get('blog', '/blog/' + this.blog_id, requestInfo)
      .then(response => {
        console.log(response);
        if(response.length == 0) {
          alert("The post has already been deleted by the author.");
        } else {
          if(this.checkIfCommentExists(response)) {
            this.replyEvent.emit(this.reply);
          } else {
            alert("The comment you are trying to reply to has been deleted by the author.");
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Before we emit the event, to update/delete/like/dislike the comment reply, we need
   * to check if the comment (parent) is still in the DB
   */
  checkIfCommentExists(response: any): boolean {
    for(var i=0; i<response.comments.length; i++) {
      if(response.comments[i].comment_id === this.comment_id) {
        return true;
      }
    }
    return false;
  }

}
