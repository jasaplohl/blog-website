import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BlogPost } from 'src/app/models/blog-post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() declare blogPosts: BlogPost[];
  @Output() refreshEvent = new EventEmitter<Boolean>();

  constructor() {}

  ngOnInit() {
  }

  requestRefresh() {
    this.refreshEvent.emit(true);
  }
}
