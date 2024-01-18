import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  userData = { username: '', password: '', confirmPassword: '' };
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  register(registerForm: any) {
    this.errorMessage = '';

    if (registerForm.valid) {
      if (this.userData.password === this.userData.confirmPassword) {
        this.http
          .post<{ registrationSuccess: boolean }>(
            `http://localhost:5000/create`,
            this.userData
          )
          .subscribe(
            (response) => {
              if (response && response.registrationSuccess) {
                this.router.navigateByUrl('/login');
              } else {
                this.errorMessage = 'Registration failed. Please try again.';
              }
            },
            (error) => {
              this.errorMessage = 'Registration failed: ' + error.message;
            }
          );
      } else {
        this.errorMessage = 'Passwords do not match';
      }
    } else {
      this.errorMessage = 'Form is not valid';
    }
  }
}
