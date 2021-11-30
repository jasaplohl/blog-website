import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, Auth } from 'aws-amplify';

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

  onCreate(blogPost: any): void {
    this.createBlog(blogPost);
  }

  async createBlog(blogPost: any) {
    const user = await Auth.currentAuthenticatedUser();

    const requestInfo = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      },
      body: {
        user_id: "",
        user_name: user.username,
        blog_content: blogPost.blogContent,
        image_id: ""
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
                  })
                  .catch(error => {
                    console.log("Error: ", error);
                    this.newBlogForm.reset();
                  });
              });
  }
}
