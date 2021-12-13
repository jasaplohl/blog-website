import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import {Router} from "@angular/router"
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public newBlogForm: FormGroup;
  public confirmationBlogForm: FormGroup;

  username!: string;
  
  ngOnInit(): void {}

  constructor(fb: FormBuilder, private router: Router, private modalService: NgbModal) {
    this.newBlogForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.confirmationBlogForm = fb.group({
      verificationCode: ["", Validators.required]
    });
  }

  async onLogin(userInfo: any, content: TemplateRef<any>) {
    this.username = userInfo.username;
    Auth.signIn(userInfo.username, userInfo.password)
      .then(response => {
        console.log(response);
        this.router.navigate(["/"]);
      })
      .catch(error => {
        console.error(error);
        switch(error.message) {
          case 'User is not confirmed.':
            this.confirmEmail(content);
            break;
          default:
            //TODO: error msg display
            alert(error.message);
            break;
        }
      });
  }

  /**
   * Opens the modal for email confirmation
   */
  confirmEmail(content: TemplateRef<any>) {
      this.modalService.open(content).result.then((result) => {
        // When we save the changes
        console.log(result);
        Auth.confirmSignUp(this.username, result.verificationCode)
          .then(result => {
            console.log(result);
          })
          .catch(error => {
            alert(error.message);
          });
      }, (reason) => {
        // When we cancel the changes
        console.log(reason);
      });
  }

  async resendConfirmationCode() {
    Auth.resendSignUp(this.username)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

}
