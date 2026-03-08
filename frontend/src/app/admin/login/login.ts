import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {

  username = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  login() {
    this.loading = true;
    this.errorMsg = '';

    this.http.post<any>(`${environment.apiUrl}/api/Auth/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Invalid username or password.';
      }
    });
  }
}