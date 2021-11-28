import { Component, OnInit } from '@angular/core';
import { API, Auth } from 'aws-amplify';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  blogPosts!: { blog_id: String, user_id: String, blog_content: String, blog_image: boolean }[];

  constructor() {
    this.blogPosts = [];
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    // const user = await Auth.currentAuthenticatedUser();
    // const token = user.signInUserSession.idToken.jwtToken;
    
    const requestInfo = {
      headers: {
        Authorization: null
      }
    };
    API
      .get('blog', '/blog', requestInfo)
      .then(response => {
        console.log(response);
        this.formatData(response);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  formatData(response: any) {
    for(var i=0; i<response.length; i++) {
      this.blogPosts.push({
        blog_id: response[i].blog_id,
        user_id: response[i].user_id,
        blog_content: response[i].blog_content,
        blog_image: response[i].blog_image
      });
    }
  }

}
