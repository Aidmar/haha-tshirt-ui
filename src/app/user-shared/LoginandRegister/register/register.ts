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



}

