import { Component, OnInit, Input } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser!: String;

  constructor() {}

  async ngOnInit() {}

  async signOut() {
    Auth.currentUserPoolUser()
      .then(response => {
        response.signOut()
      })
      .catch(error => {
        console.log(error)
      });
  }

  // ngOnChanges() {
  //   console.log("Header: " + this.isSignedIn);
  // }
}
