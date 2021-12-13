import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import {Router} from "@angular/router"
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  username!: string;

  public newBlogForm: FormGroup;
  public confirmationBlogForm: FormGroup;

  constructor(fb: FormBuilder, private router: Router, private modalService: NgbModal) {
    this.newBlogForm = fb.group({
      email: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
      phone: ["", Validators.required]
    });
    this.confirmationBlogForm = fb.group({
      verificationCode: ["", Validators.required]
    });
  }

  ngOnInit(): void {
  }

  async onSignup(userInfo: any, content: TemplateRef<any>) {
    this.username = userInfo.username;
    Auth.signUp({ username: userInfo.username, password: userInfo.password, attributes: { email: userInfo.email, phone_number: "+"+userInfo.phone } })
      .then(response => {
        console.log(response);
        this.confirmEmail(content);
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Opens the modal for email confirmation
   */
   confirmEmail(content: TemplateRef<any>) {
    this.modalService.open(content).result.then((result) => {
      // When we save the changes
      Auth.confirmSignUp(this.username, result.verificationCode)
        .then(result => {
          console.log(result);
          this.router.navigate(["/login"]);
        })
        .catch(error => {
          console.error(error);
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
