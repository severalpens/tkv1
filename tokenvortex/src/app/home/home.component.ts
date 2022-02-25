import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/_services';
import { User } from '../auth/_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: string;
  currentUser: User;
  constructor(public authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.isLoggedIn = this.currentUser && this.currentUser.token;

   }


  ngOnInit(): void {
  }

}
