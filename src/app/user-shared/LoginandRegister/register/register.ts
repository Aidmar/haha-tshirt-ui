import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../model';
import { AuthService } from '../auth-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [RouterLink , FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  model: RegisterRequest;
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.model = {
      username: '',
      email: '',
      password: '',
      roles: ['Reader'] // Hardcoded for security as we discussed!
    };
  }

onFormSubmit(): void {
  this.authService.register(this.model)
  .subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'WELCOME TO THE CREW!',
        text: 'Account created successfully. Please login.',
        confirmButtonColor: '#000',
        customClass: { popup: 'my-swal-border' }
      }).then(() => {
        this.router.navigateByUrl('/login');
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'REGISTRATION FAILED',
        text: 'That email might be taken, or the server is having a nap.',
        confirmButtonColor: '#000',
        customClass: { popup: 'my-swal-border' }
      });
    }
  });
}

}

