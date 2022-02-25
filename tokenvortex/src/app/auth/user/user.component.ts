import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IEntity } from 'src/app/classes';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  isLoggedIn: string;
  currentUser: any;
  username: string;
  entities: IEntity[];
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
      this.username = this.currentUser.username;
      this.isLoggedIn = this.currentUser && this.currentUser.token;
  
   }

  ngOnInit(): void {
    

  }

  logout(){
    this.router.navigateByUrl('/logout');
  }

  seed(){
      this.http.get(`${environment.apiUrl}/entities/seed`).subscribe((entities: Array<IEntity>) => {    
        this.entities = entities; 
      });

  }

}
