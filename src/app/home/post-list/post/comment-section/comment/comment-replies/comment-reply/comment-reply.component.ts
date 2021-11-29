import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentReply } from 'src/app/models/comment-reply.model';

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent implements OnInit {
  @Input() declare reply: CommentReply;

  /**
   * Called when:
   * - a reply has been updated
   * - a user liked or disliked the reply
   */
   @Output() replyEvent = new EventEmitter<CommentReply>();

  constructor() { }

  ngOnInit(): void {
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

}
