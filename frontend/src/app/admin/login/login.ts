import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit{

  username = '';
  password = '';

  constructor(private http: HttpClient,
            private router: Router) {}
  login() {
    this.http.post<any>('https://localhost:7076/api/Auth/login', {
      username: this.username,
      password: this.password
    }).subscribe(res => {
  localStorage.setItem('token', res.token);
  alert('Login Successful');
  this.router.navigate(['/admin/dashboard']);
});
  }
  ngOnInit() {
  const token = localStorage.getItem('token');
  if (token) {
    this.router.navigate(['/admin/dashboard']);
  }
}
}