import { Component, OnInit } from '@angular/core';
import { API, Auth } from 'aws-amplify';

import { BlogPost } from 'src/app/models/blog-post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  blogPosts!: BlogPost[];

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
      // headers: {
      //   Authorization: null
      // }
    };
    API
      .get('blog', '/blog', requestInfo)
      .then(response => {
        this.formatData(response);
        this.orderPostsByTimeStamp(this.blogPosts);
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  formatData(response: any) {
    console.log(response);

    for(var i=0; i<response.length; i++) {
      var post = new BlogPost(response[i].blog_id, response[i].user_id, response[i].user_name, response[i].timestamp, response[i].blog_content, response[i].image_id,
                  response[i].likes, response[i].dislikes, response[i].comments);
      this.blogPosts.push(post);
      console.log(response[i].timestamp);
    }
  }

  orderPostsByTimeStamp(posts: BlogPost[]) {
    this.quickSort(posts, 0, posts.length-1);
  }

  quickSort(arr: BlogPost[], low: number, high: number) {
      if (low < high){
          var pi: number = this.partition(arr, low, high);

          this.quickSort(arr, low, pi - 1);
          this.quickSort(arr, pi + 1, high);
      }
  }

  partition(arr: BlogPost[], low: number, high: number) {
    var pivot: BlogPost = arr[high]; 
      
    // Index of smaller element and indicates the right position of pivot found so far
    var i = (low - 1); 
  
    for(var j = low; j <= high - 1; j++) {
          
        // If current element is smaller than the pivot
        if (arr[j].timestamp > pivot.timestamp) {
            // Increment index of smaller element
            i++; 
            this.swap(arr, i, j);
        }
    }
    this.swap(arr, i + 1, high);
    return (i + 1);
  }

  swap(arr: BlogPost[], i: number, j: number) {
    var temp: BlogPost = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
