import { Component, ChangeDetectorRef, Input  } from '@angular/core';
import { Auth, Hub } from 'aws-amplify';
import { onAuthUIStateChange, CognitoUserInterface, AuthState, FormFieldTypes  } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blog-website';
  currentUser!: String;

  async ngOnInit() {
    // console.log(Auth.Credentials);
    Auth.currentSession()
      .then(response => {
        console.log(response);
        this.currentUser = response.getAccessToken().payload.username;
      })
      .catch(error => {
        //No user is signed in
        console.log(error);
        this.currentUser = undefined!;
      });

    const listener = (data: any) => {
      switch(data.payload.event) {
        case 'signIn':
          console.log("signIn");
          console.log(data);
          this.currentUser = data.payload.data.username;
          break;
        case 'signUp':
          console.log("signUp");
          console.log(data);
          break;
        case 'signOut':
          console.log("signOut");
          console.log(data);
          this.currentUser = undefined!;
          break;
        default:
          console.log("Other event");
          console.log(data);
          break;
      }
    }

    Hub.listen("auth", listener);
  }
}
