import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit {

  loginData: any = {
    userName: '',
    password: ''
  };

  submitted = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
  
    this.loginData = { userName: '', password: '' };
  }

  login() {
    this.submitted = true;


    if (!this.loginData.userName || !this.loginData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Data',
        text: 'Please enter both username and password',
        confirmButtonColor: '#6c5ce7'
      });
      return;
    }

    this.auth.login(this.loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Username or password is incorrect',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}