import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly bootstrapped = this.authService.bootstrapped;
  readonly isAuthenticated = computed(() => Boolean(this.currentUser()));

  ngOnInit(): void {
    this.authService.bootstrap();
  }

  logout(): void {
    this.authService.logout();
  }
}
