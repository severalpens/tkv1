import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/_services';
import { User } from '../auth/_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: string;
  username: string;
  constructor(public authenticationService: AuthenticationService) {
    const currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit(): void {
  }

}
