import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-blue-600 selection:text-white font-sans antialiased transition-colors duration-200">
      <app-navbar />
      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <router-outlet />
      </main>
      <app-footer />
      <app-toast />
    </div>
  `
})
export class MainLayoutComponent {}
