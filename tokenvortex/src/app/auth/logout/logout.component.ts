import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Component({ templateUrl: 'logout.component.html' })
export class LogoutComponent  {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
      this.authenticationService.logout();
      this.router.navigateByUrl('/');
    }


}
