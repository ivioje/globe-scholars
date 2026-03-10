import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth/auth-service';

@Component({
  selector: 'app-landing-page',
  imports: [
    RouterLink,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  constructor(public authService: AuthService) {
  }
}
