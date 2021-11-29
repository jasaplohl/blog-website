import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() isSignedIn!: boolean;

  constructor() {}

  ngOnInit() {}

  // ngOnChanges() {
  //   console.log("Header: " + this.isSignedIn);
  // }
}
