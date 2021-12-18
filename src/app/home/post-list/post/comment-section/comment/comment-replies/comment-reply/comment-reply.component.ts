import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { Auth } from 'aws-amplify';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
  editable!: boolean;
  timeFormat!: String;
  show!: String;
  
  @Output() requestUpdateEvent = new EventEmitter<void>();

  constructor(private modalService: NgbModal) { }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
      .then(usr => {
        if(usr.attributes.sub === this.reply.user_id) {
          this.editable = true;
        }
        this.currentUser = usr.username;
      })
      .catch(error => {
        console.error(error);
      });
      
    this.timeFormat = moment(new Date(this.reply.timestamp)).fromNow();
  }

  showMode(mode: String, content: TemplateRef<any>) {
    this.show = mode;
    this.modalService.open(content);
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

  likeReply() {
    this.reply.likeReply()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  dislikeReply() {
    this.reply.dislikeReply()
      .then(() => {
        this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  editReply() {
    this.reply.editReply()
      .then(() => {
        // this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

  deleteReply() {
    this.reply.deleteReply()
      .then(() => {
        // this.requestUpdateEvent.emit();
      })
      .catch(error => {
        console.error(error);
      });
  }

}
