import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BlogPost } from 'src/app/models/blog-post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() declare blogPosts: BlogPost[];

  constructor() {}

  ngOnInit() {
  }

  onNewPostEvent(post: BlogPost) {
    this.blogPosts.push(post);
    console.log(this.blogPosts);
  }

}
