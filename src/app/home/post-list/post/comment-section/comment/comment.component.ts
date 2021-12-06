import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment: BlogComment;

  currentUser!: String;
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

  toggleCommentReplies() {
    this.showCommentReplies = !this.showCommentReplies;
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

  onUpdateComment() {
    this.comment.updateComment();
  }

  likeComment() {
    console.log(this.comment);
    this.comment.likeComment();
  }

  dislikeComment() {
    this.comment.dislikeComment();
  }

}
