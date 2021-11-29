import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() declare blog_id: String;
  @Input() declare comment: any;

  constructor() {}

  ngOnInit(): void {
  }

  convertToDate(dateStr: string) {
    return new Date(dateStr);
  }

}
