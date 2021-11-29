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
import { NewPostComponent } from './home/new-post/new-post.component';
import { PostListComponent } from './home/post-list/post-list.component';
import { PostComponent } from './home/post-list/post/post.component';
import { CommentSectionComponent } from './home/post-list/post/comment-section/comment-section.component';
import { CommentComponent } from './home/post-list/post/comment-section/comment/comment.component';
import { CommentRepliesComponent } from './home/post-list/post/comment-section/comment/comment-replies/comment-replies.component';
import { CommentReplyComponent } from './home/post-list/post/comment-section/comment/comment-replies/comment-reply/comment-reply.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, // localhost:4200/login
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent }
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
    SignupComponent,
    CommentSectionComponent,
    CommentComponent,
    CommentRepliesComponent,
    CommentReplyComponent
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
