import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  username = '';
  password = '';

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('https://localhost:7076/api/Auth/login', {
      username: this.username,
      password: this.password
    }).subscribe(res => {
      localStorage.setItem('token', res.token);
      alert('Login Successful');
    });
  }
}