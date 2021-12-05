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
    this.commentCount = this.blog.comments.length;
    this.blog.comments.forEach(element => {
      this.commentCount += element.replies.length;
    });

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

  onCommentsEvent(comments: BlogComment[]) {
    this.blog.comments = comments;
    this.uploadData();
  }

  likePost() {
    if(!this.blog.likes.includes(this.currentUser)) {
      var index = this.blog.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.dislikes.splice(index, 1);
      }
      this.blog.likes.push(this.currentUser);
    } else {
      var index = this.blog.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.likes.splice(index, 1);
      }
    }
    this.uploadData();
  }

  dislikePost() {
    if(!this.blog.dislikes.includes(this.currentUser)) {
      var index = this.blog.likes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.likes.splice(index, 1);
      }
      this.blog.dislikes.push(this.currentUser);
    } else {
      var index = this.blog.dislikes.indexOf(this.currentUser)
      if(index > -1) {
        this.blog.dislikes.splice(index, 1);
      }
    }
    this.uploadData();
  }

  /**
   * Opens the modal for editing the post
   */
  onEditPostClick(content: TemplateRef<any>) {
    this.modalService.open(content).result.then((result) => {
      // When we save the changes
      console.log(result);
      this.blog.blog_content = result.blogEditContent; //First we update it locally
      this.uploadData(); //Then we upload it to the DB
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

  /**
   * Uploades the updated post to the DB
   */
   async uploadData() {
    const user = await Auth.currentAuthenticatedUser();

    const getRequestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      }
    };

    // First we fetch the current blog, to see if there have been any changes
    API
      .get('blog', '/blog/' + this.blog.blog_id, getRequestInfo)
      .then(response => {
        // this.blog.updateBlogPost(response);
        // Then we upload the changes to the current blog
        const postRequestInfo = {
          headers: {
            Authorization: user.signInUserSession.idToken.jwtToken
          },
          body: this.blog.blogToJSON() 
        };
        API
          .put('blog', '/blog', postRequestInfo)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error("Error: ", error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }

}
