import { Component, OnInit, Input } from '@angular/core';
import { Auth, CognitoUser } from '@aws-amplify/auth';
import { AuthState } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // loggedIn: any;
  @Input() authState!: AuthState;

  constructor() { 
  }

  ngOnInit() {}

  // async ngOnInit() {
  //   this.loggedIn = await Auth.currentAuthenticatedUser();
  //   console.log(this.loggedIn);
  // }
}
