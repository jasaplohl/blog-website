import { Component, OnInit, Input } from '@angular/core';
import { BlogPost } from 'src/app/models/blog-post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() declare blog: BlogPost;

  showCommentSection: boolean;

  constructor() { 
    this.showCommentSection = false;
  }

  toggleCommentSection() {
    this.showCommentSection = !this.showCommentSection;
  }

  ngOnInit(): void {
  }

}
