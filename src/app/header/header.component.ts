import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Auth } from 'aws-amplify';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser!: String;

  constructor(private modalService: NgbModal, private router: Router) {}

  async ngOnInit() {}

  async signOut() {
    Auth.currentUserPoolUser()
      .then(response => {
        response.signOut();
        window.location.reload();
      })
      .catch(error => {
        console.error(error)
      });
  }

  onLogOutClick(content: TemplateRef<any>) {
    this.modalService.open(content).result.then(() => {
      // When we save the changes
      this.signOut()
    }, (reason) => {
      // When we cancel the changes
      console.log(reason);
    });
  }
}
