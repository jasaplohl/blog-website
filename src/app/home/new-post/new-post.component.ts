import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, Auth, Storage } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  @ViewChild("imageInput") imageInput!: ElementRef;
  @Output() newPostEvent = new EventEmitter<String>();
  imgName!: string;
  imgFile!: File;
  url!: any;

  currentUser!: String;

  public newBlogForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newBlogForm = fb.group({
      blogContent: ["", Validators.required]
    });
  }

  async ngOnInit() {
    await Auth.currentAuthenticatedUser()
      .then(response => {
        this.currentUser = response.username;
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * When the user adds an image.
   */
  onImageUpload(event: any) {
    this.imgFile = event.target.files[0];
    
    if(this.imgFile) {
      if(!this.imgFile.type.match("image.*")) {
        alert("Invalid file format!");
        this.imgFile = undefined!;
        this.imageInput.nativeElement.value = "";
      } else {
        if(this.imgFile.size > environment.max_file_size) {
          alert("File too big!");
          this.imgFile = undefined!;
          this.imageInput.nativeElement.value = "";
        } else {
          this.imgName = event.target.files[0].name;
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event) => {
            this.url = event.target?.result;
          };
        }
      }
    } else {
      this.imgName = undefined!;
    }
  }

  removeUploadedImage() {
        this.imageInput.nativeElement.value = "";
        this.url = "";
        this.imgFile = undefined!;
        this.imgName = undefined!;
  }

  async onCreate(blogPost: any) {
    if(this.imgFile) {
      await Storage
        .put(uuidv4(), this.imgFile, {
          level: "public",
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          }
        })
        .then(res => {
          console.log(res);
          this.removeUploadedImage();
          this.createBlog(blogPost, res.key);
        })
        .catch(error => {
          console.error(error);
          alert("Unable to upload the image."); //TODO - display error
        });
    } else {
      this.createBlog(blogPost);
    }
  }

  async createBlog(blogPost: any, imageID?: string) {
    await Auth.currentAuthenticatedUser()
      .then(response => {
        const requestInfo = {
          headers: {
            Authorization: response.signInUserSession.idToken.jwtToken
          },
          body: {
            blog_content: blogPost.blogContent,
            image_id: imageID
          }
        };

        API
          .post('blogapi', '/blog', requestInfo)
          .then(response => {
            this.newPostEvent.emit(response.blog_id);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        this.newBlogForm.reset();
      });
  }
}
