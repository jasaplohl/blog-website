import { Component, OnInit } from '@angular/core';
import { API } from 'aws-amplify';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const requestInfo = {
      headers: {
        Authorization: null
      }
    };
    API
      .get('blogsApi', '/blogs', requestInfo)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log("Error: ", error.response);
      });
  }

}
