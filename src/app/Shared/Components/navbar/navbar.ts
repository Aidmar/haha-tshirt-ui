import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { Hero } from "../../../Home/hero/hero";
import { FeaturesSection } from "../../../Home/features-section/features-section";
import { NewArrivals } from "../../../Home/new-arrivals/new-arrivals";
import { Footer } from "../../../Home/footer/footer";
import { AuthService } from '../../../user-shared/LoginandRegister/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink , CommonModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
// admin@codepluse.com
// Admin@123


 username?: string;
 showAdmin: boolean = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  

ngOnInit(): void {

  this.authService.loadUserFromStorage();

  this.authService.user$.subscribe(user => {
    this.username = user;
    this.cdr.detectChanges();
  });

  this.authService.userRoles$.subscribe(roles => {
  
    this.showAdmin = roles.includes('Writer'); 
    this.cdr.detectChanges();
  });
}
    goHome() {
    if (this.router.url === '/') {
   
      window.location.reload();
    } else {
      this.router.navigate(['/']);
    }
  }
  

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
