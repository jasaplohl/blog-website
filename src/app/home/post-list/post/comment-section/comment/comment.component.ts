import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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

  show!: String;
  currentUser!: String;
  showCommentReplies: boolean;
  timeFormat!: String;
  editable!: boolean;

  constructor(private modalService: NgbModal) {
    this.showCommentReplies = false;
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
      .then(usr => {
        if(usr.attributes.sub === this.comment.user_id) {
          this.editable = true;
        }
        this.currentUser = usr.username;
      })
      .catch(error => {
        console.error(error);
      });
      
    this.timeFormat = moment(new Date(this.comment.timestamp)).fromNow();
  }

  toggleCommentReplies() {
    this.showCommentReplies = !this.showCommentReplies;
  }

  onUpdateComment() {
    this.comment.updateComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  likeComment() {
    this.comment.likeComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  dislikeComment() {
    this.comment.dislikeComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  onEditCommentClick() {
    this.comment.updateComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  onDeleteCommentClick() {
    this.comment.deleteComment()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  showMode(mode: String, content: TemplateRef<any>) {
    this.show = mode;
    this.modalService.open(content);
  }

  onRequestUpdate() {
    this.requestUpdateEvent.emit();
  }

}
