import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API } from 'aws-amplify';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  public newBlogForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.newBlogForm = fb.group({
      blogContent: ["", Validators.required]
    });
  }

  ngOnInit(): void {
  }

  async getBlogs() {
    const requestInfo = {
      headers: {
        Authorization: null
      },
      body: {
        MyHeader: "Hello world"
      }
    };

    API
      .post('uploadPostApi', '/uploadpost', requestInfo)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  onCreate(blogPost: any): void {
    console.log("Creating a new post: " + blogPost.blogContent);

    this.getBlogs();
    // const user = Auth.currentAuthenticatedUser();
    // const token = user.signInUserSession.idToken.jwtToken;
    // const requestInfo = {
    //   headers: {
    //     Authorization: null
    //   },
    //   body: {
    //     blog_id: "",
    //     user_id: "",
    //     blog_content: "",
    //     blog_image: false
    //   }
    // };
    // API
    //   .post('blogsApi', '/blogs', requestInfo)
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     console.log("Error: ", error.response);
    //   });
  }

}
