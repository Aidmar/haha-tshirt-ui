import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../model';
import { AuthService } from '../auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink , FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
model: LoginRequest;
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.model = {
      email: '',
      password: ''
    };
  }
  

onFormSubmit(): void {
  this.authService.login(this.model)
  .subscribe({
    next: (response) => {
      // CHANGE THIS: Use the service method we created
      // This saves the token AND updates the username in the navbar immediately
      this.authService.setUser(response.jwtToken);
      
      // Redirect to home page
      this.router.navigateByUrl('/');
    },
    error: (err) => {
      console.error(err);
      alert("Login failed. Check your email or password.");
    }
  });
}
}
