import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, // localhost:4200/login
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    NewPostComponent,
    PostListComponent,
    PostComponent,
    HeaderComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AmplifyUIAngularModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
