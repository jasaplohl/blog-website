import { Component, OnInit, Input } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // @Input() isSignedIn!: boolean;
  @Input() currentUser!: String;

  constructor() {}

  async ngOnInit() {}

  // ngOnChanges() {
  //   console.log("Header: " + this.isSignedIn);
  // }
}
