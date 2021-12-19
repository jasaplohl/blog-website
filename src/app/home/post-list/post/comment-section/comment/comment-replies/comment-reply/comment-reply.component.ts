import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommentReply } from 'src/app/models/comment-reply.model';
import { Auth } from 'aws-amplify';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Input() declare deletable: boolean;

  currentUser!: String;
  editable!: boolean;
  timeFormat!: String;
  show!: String;
  
  @Output() deleteReplyEvent = new EventEmitter<String[]>();
  @Output() requestUpdateEvent = new EventEmitter<void>();

  public editReplyForm!: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) { }

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

    //The modal for editting the post content
    if(this.reply) {
      this.editReplyForm = this.fb.group({
        replyEditContent: [this.reply.reply_content, Validators.required]
      });
    } else {
      this.editReplyForm = this.fb.group({
        blogEditContent: ["", Validators.required]
      });
    }
      
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

  editReply(content: TemplateRef<any>) {
    this.modalService.open(content).result.then((result) => {
      // When we save the changes
      if(result.replyEditContent.trim() !== "") {
        this.reply.editReply(result.replyEditContent)
        .then(() => {
          this.requestUpdateEvent.emit();
        })
        .catch(error => {
          console.error(error);
        });
      }
    }, (reason) => {
      // When we cancel the changes
      console.log(reason);
    });
  }

  deleteReply() {
    this.deleteReplyEvent.emit([this.comment_id, this.reply.reply_id]);
  }

}
