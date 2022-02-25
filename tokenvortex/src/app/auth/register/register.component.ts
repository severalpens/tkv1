import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import randomWords from 'random-words';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    username: String;
    password: String;
    isTemp: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
        let random = randomWords();
        this.username = `${random}`;
        this.password = `${random}1`;
        this.isTemp = false;

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: [this.username, Validators.required],
            password: [this.password, Validators.required],
            confirmPassword: [this.password, Validators.required],
            isTemp: [this.isTemp],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        if (this.f.password.value !== this.f.confirmPassword.value) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.f.username.value, this.f.password.value, this.isTemp)
            .pipe(first())
            .subscribe(
                data => {
                    //this.router.navigate([this.returnUrl]);
                    this.router.navigateByUrl('/user');
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
