import { Component } from '@angular/core';
import { Hero } from "../hero/hero";
import { FeaturesSection } from "../features-section/features-section";
import { NewArrivals } from "../new-arrivals/new-arrivals";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-home',
  imports: [Hero, FeaturesSection, NewArrivals, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
