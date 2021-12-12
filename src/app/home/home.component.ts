import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../models/blog-post.model';
import { API, Auth } from 'aws-amplify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  blogIDs: String[];
  blogPosts: BlogPost[];

  constructor() { 
    this.blogPosts = [];
    this.blogIDs = [];
  }

  ngOnInit(): void {
    this.fetchData();
  }

  /**
   * We fetch the new post and add it to the list (without refreshing the entire page)
   */
  async onNewPostEvent(blog_id: String) {
    const requestInfo = {
      headers: {
        Authorization: undefined
      }
    };

    await Auth.currentAuthenticatedUser()
        .then(response => {
          requestInfo.headers.Authorization = response.signInUserSession.idToken.jwtToken;

          API
            .get('blogapi', '/blog/' + blog_id, requestInfo)
            .then(response => {
              console.log(response);
              response = response[0];
              var post = new BlogPost(response.blog_id, response.user_id, response.user_name, response.timestamp, response.blog_content, response.image_id,
                response.likes, response.dislikes, response.comments);
              this.blogPosts = [post].concat(this.blogPosts); //Insert the new post at the beginning
              if(post.image_id && post.image_id.trim() !== "") {
                post.getBlogImage(); //Display the image
              }
            })
            .catch(error => {
              console.log("Error: ", error);
            });
        })
        .catch(error => {
          console.log(error);
        });
  }

  async fetchData() {
    const requestInfo = {
      headers: {
        Authorization: "" // user.signInUserSession.idToken.jwtToken
      }
    };

    // const user = await Auth.currentAuthenticatedUser();
    Auth.currentSession()
      .then(response => {
        requestInfo.headers.Authorization = response.getAccessToken().getJwtToken();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        requestInfo.headers.Authorization = "";
        API
          .get('blogapi', '/blog', requestInfo)
          .then(response => {
            console.log(response);
            this.formatData(response);
            this.orderPostsByTimeStamp(this.blogPosts);
          })
          .catch(error => {
            console.log("Error: ", error);
          });
      });
  }

  formatData(response: any) {
    for(var i=0; i<response.length; i++) {
      var post = new BlogPost(response[i].blog_id, response[i].user_id, response[i].user_name, response[i].timestamp, response[i].blog_content, response[i].image_id,
                  response[i].likes, response[i].dislikes, response[i].comments);

      var index = this.blogIDs.indexOf(post.blog_id);
      
      post.getBlogImage();

      /**
       * TODO
       */
      if(index > -1) {
        //If the blog is already displayed, we just update the values
        this.blogPosts[index] = post;
      } else {
        this.blogIDs.push(post.blog_id);
        this.blogPosts.push(post);
      }
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
