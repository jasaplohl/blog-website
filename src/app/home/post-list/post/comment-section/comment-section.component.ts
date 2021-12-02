import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comments: BlogComment[];

  /**
   * Called when:
   * - a comment has been added
   * - a comment has been updated
   * - a user liked or disliked the comment
   */
   @Output() commentsEvent = new EventEmitter<BlogComment[]>();

  public newCommentForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newCommentForm = fb.group({
      comment_content: ["", Validators.required]
    });
  }

  ngOnInit(): void {}

  async onCreateComment(commentPost: any) {
    this.newCommentForm.reset();
    
    const user = await Auth.currentAuthenticatedUser();
    await Auth.currentUserInfo()
              .then(user_ => {
                //We create a new comment
                var newComment = new BlogComment(
                  this.blog_id, uuidv4(), user_.attributes.sub, user.username, new Date().toISOString(), 
                  commentPost.comment_content, [], [], []
                );
                this.comments.push(newComment);
                this.emitCommentEvent();
              });
  }

  onCommentEvent(comment: BlogComment) {
    this.comments.forEach(element => {
      if(element.comment_id === comment.comment_id) {
        element = comment;
        console.log(true);
      } else {
        console.log(false);
      }
    });
    this.emitCommentEvent();
  }

  /**
   * Emits the comments to the parent component.
   */
   emitCommentEvent() {
    this.commentsEvent.emit(this.comments);
  }
  
}
