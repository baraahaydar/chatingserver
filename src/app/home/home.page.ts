import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  login() {
    this.http
      .post('http://localhost:5000/auth/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          console.log(response, 'response');

          // Handle successful response
          this.navCtrl.navigateRoot('/conversation');
          this.cookieService.set('username', this.username);
        },
        error: (error) => {
          // Handle error
          console.error('Login failed', error);
          // Implement a user-friendly way to show this error
        },
      });
  }
}
