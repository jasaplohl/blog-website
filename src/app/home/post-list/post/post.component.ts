import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BlogComment } from 'src/app/models/blog-comment.model';
import { BlogPost } from 'src/app/models/blog-post.model';
import { API, Auth } from 'aws-amplify';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() declare blog: BlogPost;
  @Output() deletePostEvent = new EventEmitter<BlogPost>();

  currentUser!: String;

  showCommentSection: boolean;
  showDeletePostModal: boolean;
  commentCount!: number;

  public newBlogForm!: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) { 
    this.showCommentSection = false;
    this.showDeletePostModal = true;
  }

  toggleCommentSection() {
    this.showCommentSection = !this.showCommentSection;
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
              .then(usr => {
                this.currentUser = usr.username;
              });

    //We display the comment count for each post
    this.commentCount = this.blog.comments.length;
    this.blog.comments.forEach(element => {
      this.commentCount += element.replies.length;
    });

    //The modal for editting the post content
    if(this.blog) {
      this.newBlogForm = this.fb.group({
        blogEditContent: [this.blog.blog_content, Validators.required]
      });
    } else {
      this.newBlogForm = this.fb.group({
        blogEditContent: ["", Validators.required]
      });
    }
  }

  /**
   * Opens the modal for editing the post
   */
  onEditPostClick(content: TemplateRef<any>) {
    this.modalService.open(content).result.then((result) => {
      // When we save the changes
      this.blog.updatePostContent(result.blogEditContent);
    }, (reason) => {
      // When we cancel the changes
      console.log(this.getDismissReason(reason));
    });
  }

  /**
   * Logs the dismissal reason
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  async likePost() {
    this.blog.likePost();
  }

  async dislikePost() {
    this.blog.dislikePost();
  }

  /**
   * Deletes the post from the DB
   * TODO
   */
   async onDeletePostClick() {
    if(confirm("Are you sure you want to delete your post?")) {
      const user = await Auth.currentAuthenticatedUser();

      const getRequestInfo = {
        headers: {
          Authorization: user.signInUserSession.idToken.jwtToken
        },
        body: {
          blog_id: this.blog.blog_id
        }
      };
      API
        .del('blog', '/blog/' + this.blog.blog_id, getRequestInfo)
        .then(response => {
          console.log(response);
          this.deletePostEvent.emit(this.blog);
        })
        .catch(error => {
          console.log("error: ");
          console.log(error);
        });
        
    }
  }

}
