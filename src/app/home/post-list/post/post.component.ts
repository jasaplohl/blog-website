import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input('post') declare post: { blog_id: String, user_id: String, blog_content: String, blog_image: boolean };

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
