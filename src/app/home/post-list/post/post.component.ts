import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BlogPost } from 'src/app/models/blog-post.model';
import { API, Auth, Storage } from 'aws-amplify';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

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

  timeFormat!: String;

  show!: String;
  editable!: boolean;

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
        if(usr.attributes.sub === this.blog.user_id) {
          this.editable = true;
        }
        this.currentUser = usr.username;
      })
      .catch(error => {
        console.error(error);
      });

    this.countComments(); // We get the total number of comments

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

    this.timeFormat = moment(new Date(this.blog.timestamp)).fromNow();
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
   */
   async onDeletePostClick() {
    if(confirm("Are you sure you want to delete your post?")) {
      await Auth.currentAuthenticatedUser()
        .then(response => {
          const requestInfo = {
            headers: {
              Authorization: response.signInUserSession.idToken.jwtToken
            }
          };

          API
            .del('blogapi', '/blog/'+ this.blog.blog_id.trim(), requestInfo)
            .then(response => {
              console.log(response);
              if(this.blog.image_id)
                this.deleteImage(this.blog.image_id);
              else
                this.deletePostEvent.emit(this.blog);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });   
    }
  }

  /**
   * Removes the image from the S3 bucket
   */
  async deleteImage(imgId: string) {
    await Storage
        .remove(imgId, {
          level: "public"
        })
        .then(res => {
          console.log(res);
          this.deletePostEvent.emit(this.blog);
        })
        .catch(error => {
          console.error(error);
        });
  }

  onRequestUpdate() {
    this.blog.fetchLatestBlogData()
      .then(() => {
        this.countComments();
      });
  }

  showMode(mode: String, content: TemplateRef<any>) {
    this.show = mode;
    this.modalService.open(content);
  }

  countComments() {
    //We display the comment count for each post
    this.commentCount = this.blog.comments.length;
    this.blog.comments.forEach(element => {
      this.commentCount += element.replies.length;
    });
  }

}
