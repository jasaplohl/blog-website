import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, Auth, Storage } from 'aws-amplify';
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

  public newBlogForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newBlogForm = fb.group({
      blogContent: ["", Validators.required]
    });
  }

  ngOnInit(): void {
  }

  /**
   * When the user adds an image.
   */
  onImageUpload(event: any) {
    this.imgFile = event.target.files[0];
    if(this.imgFile) {
      if(!this.imgFile.type.match("image.*")) {
        console.log("Invalid file format"); //TODO - display error
        this.imgFile = undefined!;
        this.imageInput.nativeElement.value = '';
      } else {
        this.imgName = event.target.files[0].name;
      }
    } else {
      this.imgName = undefined!;
    }
  }

  async onCreate(blogPost: any) {
    if(this.imgFile) {
      await Storage
        .put(uuidv4(), this.imgFile, {
          level: "protected",
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          }
        })
        .then(res => {
          console.log(res);
          this.createBlog(blogPost, res.key);
        })
        .catch(error => {
          console.log("Unable to upload the image."); //TODO - display error
          console.log(error);
          this.createBlog(blogPost); //We upload the post anyway
        });
    } else {
      this.createBlog(blogPost);
    }
  }

  async createBlog(blogPost: any, imageID?: string) {
    const user = await Auth.currentAuthenticatedUser();

    const requestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      },
      body: {
        user_id: "",
        user_name: user.username,
        blog_content: blogPost.blogContent,
        image_id: imageID
      }
    };
    
    this.newBlogForm.reset();

    await Auth.currentUserInfo()
              .then(user_ => {
                requestInfo.body.user_id = user_.attributes.sub
                API
                  .post('blog', '/blog', requestInfo)
                  .then(response => {
                    console.log(response);
                    this.newPostEvent.emit(response.blog_id);
                  })
                  .catch(error => {
                    console.log("Error: ", error);
                    this.newBlogForm.reset();
                  });
              });
  }
}
