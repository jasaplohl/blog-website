import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() declare comment: BlogComment;

  currentUser!: String;

  /**
   * Called when:
   * - a comment has been updated
   * - a user liked or disliked the comment
   */
   @Output() commentEvent = new EventEmitter<BlogComment>();

  showCommentReplies: boolean;

  constructor() {
    this.showCommentReplies = false;
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
              .then(usr => {
                this.currentUser = usr.username;
              });
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

  toggleCommentReplies() {
    this.showCommentReplies = !this.showCommentReplies;
  }

  /**
   * Updates the replies and emits the changes.
   */
  onRepliesEvent(eventData: CommentReply[]) {
    this.comment.replies = eventData;
    this.emitCommentEvent()
  }

  onUpdateComment() {
    //TODO: UPDATE THE COMMENT
    this.emitCommentEvent();
  }

  /**
   * Emits the comment to the parent component.
   */
   emitCommentEvent() {
    this.commentEvent.emit(this.comment);
  }

  likeComment() {
    if(!this.comment.likes.includes(this.currentUser)) {
      var index = this.comment.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.comment.dislikes.splice(index, 1);
      }
      this.comment.likes.push(this.currentUser);
    } else {
      var index = this.comment.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.comment.likes.splice(index, 1);
      }
    }
    this.emitCommentEvent()
  }

  dislikeComment() {
    if(!this.comment.dislikes.includes(this.currentUser)) {
      var index = this.comment.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.comment.likes.splice(index, 1);
      }
      this.comment.dislikes.push(this.currentUser);
    } else {
      var index = this.comment.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.comment.dislikes.splice(index, 1);
      }
    }
    this.emitCommentEvent()
  }
}
