import { Component, OnInit } from '@angular/core';
import { API } from 'aws-amplify';

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
    const requestInfo = {
      headers: {
        Authorization: null
      }
    };
    API
      .get('getPostsApi', '/getposts', requestInfo)
      .then(response => {
        response = response.blogs
        for(var i=0; i<response.length; i++) {
          this.blogPosts.push({
            blog_id: response[i].blog_id,
            user_id: response[i].user_id,
            blog_content: response[i].blog_content,
            blog_image: response[i].blog_image
          });
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

}
