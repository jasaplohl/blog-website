import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { CommentReply } from 'src/app/models/comment-reply.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() declare comment: BlogComment;

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

  ngOnInit(): void {
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
}
