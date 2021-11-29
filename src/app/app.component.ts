import { Component, ChangeDetectorRef, Input  } from '@angular/core';
import { Auth } from 'aws-amplify';
import { onAuthUIStateChange, CognitoUserInterface, AuthState, FormFieldTypes  } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blog-website';
  // user: CognitoUserInterface | undefined;
  // authState!: AuthState;
  // formFields: FormFieldTypes;

  // isSignedIn!: boolean;

  // constructor(private ref: ChangeDetectorRef) {
  //   this.formFields = [
  //     { type: "username" },
  //     { type: "password" },
  //     { type: "email" }
  //   ];
  // }

  // ngOnInit() {
  //   onAuthUIStateChange((authState, authData) => {
  //     this.authState = authState;
  //     this.user = authData as CognitoUserInterface;
  //     this.ref.detectChanges();
  //     this.isSignedIn = (authState === 'signedin') && (this.user !== undefined);

  //     // TODO: Pass the state change to the child components.
  //     // console.log(this.user);
  //     // console.log(Auth.Credentials);
  //   })
  // }

  // ngOnDestroy() {
  //   return onAuthUIStateChange;
  // }
}
