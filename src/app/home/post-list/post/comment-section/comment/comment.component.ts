import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { Auth } from 'aws-amplify';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment: BlogComment;

  @Output() requestUpdateEvent = new EventEmitter<void>();

  currentUser!: String;
  showCommentReplies: boolean;
  timeFormat!: String;

  constructor() {
    this.showCommentReplies = false;
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
      .then(usr => {
        this.currentUser = usr.username;
      })
      .catch(error => {
        console.log(error);
      });
      
    this.timeFormat = moment(new Date(this.comment.timestamp)).fromNow();
  }

  toggleCommentReplies() {
    this.showCommentReplies = !this.showCommentReplies;
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

  onUpdateComment() {
    this.comment.updateComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.log(error);
      });
  }

  likeComment() {
    this.comment.likeComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.log(error);
      });
  }

  dislikeComment() {
    this.comment.dislikeComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.log(error);
      });
  }

}
