import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Auth } from 'aws-amplify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment: BlogComment;
  @Input() declare deletable: boolean;

  @Output() deleteCommentEvent = new EventEmitter<String>();
  @Output() requestUpdateEvent = new EventEmitter<void>();

  show!: String;
  currentUser!: String;
  showCommentReplies: boolean;
  timeFormat!: String;

  editable!: boolean;

  public newCommentForm!: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
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

    //The modal for editting the post content
    if(this.comment) {
      this.newCommentForm = this.fb.group({
        commentEditContent: [this.comment.comment_content, Validators.required]
      });
    } else {
      this.newCommentForm = this.fb.group({
        blogEditContent: ["", Validators.required]
      });
    }
      
    this.timeFormat = moment(new Date(this.comment.timestamp)).fromNow();
  }

  toggleCommentReplies() {
    this.showCommentReplies = !this.showCommentReplies;
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

  onEditCommentClick(content: TemplateRef<any>) {
    this.modalService.open(content).result.then((result) => {
      // When we save the changes
      this.comment.editComment(result.commentEditContent)
        .then(() => {
          this.requestUpdateEvent.emit();
        })
        .catch(error => {
          console.error(error);
        });
    }, (reason) => {
      // When we cancel the changes
      console.log(reason);
    });
  }

  onDeleteCommentClick() {
    this.deleteCommentEvent.emit(this.comment.comment_id);
  }

  showMode(mode: String, content: TemplateRef<any>) {
    this.show = mode;
    this.modalService.open(content);
  }

  onRequestUpdate() {
    this.requestUpdateEvent.emit();
  }

}
