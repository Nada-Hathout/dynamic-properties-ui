import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
// export class RegisterComponent {

// registerData:any={
// userName:'',
// password:''
// }

// constructor(private auth:AuthService,private router:Router){}

// register(){

// this.auth.register(this.registerData).subscribe({

//  next: (res: any) => {
//         localStorage.setItem('token', res);
//         this.router.navigate(['/login']);
//         Swal.fire({
//           icon: 'success',
//           title: 'Successfully Registered',
//           text: 'You can now login with your credentials',
//           confirmButtonText: 'OK'
//         });
//       },
//       error: (err) => {
//       console.error(err);
//         Swal.fire({
//           icon: 'error',
//           title: 'Registration Failed',
//           text: 'An error occurred during registration. Please try again.',
//           confirmButtonText: 'OK'
//         });
//       }
   

// })

// }
// }
export class RegisterComponent {
  registerData: any = {
    userName: '',
    password: ''
  };
  
  submitted = false; // متغير جديد للتحكم في الـ Validation

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.submitted = true;

    // منع الإرسال لو الحقول فاضية
    if (!this.registerData.userName || !this.registerData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#6c5ce7'
      });
      return;
    }

    this.auth.register(this.registerData).subscribe({
      next: (res: any) => {
        // نصيحة: في الريجيستر غالباً بنعمل navigate للوجن والتوكن بيتاخد هناك
        // localStorage.setItem('token', res); 
        
        Swal.fire({
          icon: 'success',
          title: 'Successfully Registered',
          text: 'You can now login with your credentials',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#6c5ce7'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.error?.message || 'An error occurred during registration.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}