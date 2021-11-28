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

  async createBlog(blogPost: any) {
    // const user = Auth.currentAuthenticatedUser();
    // const token = user.signInUserSession.idToken.jwtToken;

    const requestInfo = {
      headers: {
        Authorization: null
      },
      body: {
        user_id: "",
        blog_content: blogPost.blogContent,
        image_id: ""
      }
    };

    console.log(requestInfo.body);

    API
      .post('blog', '/blog', requestInfo)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  onCreate(blogPost: any): void {
    console.log("Creating a new post: " + blogPost.blogContent);

    this.createBlog(blogPost);
  }

}
