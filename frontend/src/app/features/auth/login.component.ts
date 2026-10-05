import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';
import { FloatingObjectComponent } from '../../shared/components/floating-object/floating-object.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FloatingObjectComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)] p-6 lg:p-12 relative overflow-hidden transition-colors duration-200">
      
      <!-- Top Right Theme Switcher -->
      <div class="absolute top-6 right-6 z-20">
        <button 
          type="button" 
          (click)="themeService.toggleTheme()"
          class="p-2.5 rounded-xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
          [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'">
          @if (themeService.currentTheme() === 'dark') {
            <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          } @else {
            <svg class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
        </button>
      </div>

      <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <!-- Left Column: Editorial Info with Floating 3D Object -->
        <div class="lg:col-span-7 space-y-6 hidden lg:block">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 text-xs font-mono font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            MVGRCE · STUDENT CAMPUS PORTAL
          </div>

          <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Discover clubs. <br/>
            Compete in hackathons. <br/>
            <span class="text-blue-600 dark:text-blue-400">Connect with peers.</span>
          </h1>

          <p class="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            Maharaj Vijayaram Gajapathi Raj College of Engineering unified student hub connecting campus clubs, technical sprints, peer chat, and academic tools.
          </p>

          <div class="pt-4 max-w-sm">
            <app-floating-object variant="compact" />
          </div>
        </div>

        <!-- Right Column: Minimalist Sign In Card -->
        <div class="lg:col-span-5 w-full max-w-md mx-auto">
          <div class="mvgr-card p-8 space-y-6">
            
            <div>
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center mb-3 font-mono font-extrabold text-sm shadow-sm">
                M
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Student Portal Sign In</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter your campus registration number to enter.</p>
            </div>

            <!-- Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4 text-xs font-mono">
              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">
                  Registration Number
                </label>
                <input 
                  type="text" 
                  formControlName="registrationNumber"
                  placeholder="23331A1285"
                  class="mvgr-input uppercase"
                />
              </div>

              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">
                  Password
                </label>
                <div class="relative">
                  <input 
                    [type]="showPassword() ? 'text' : 'password'" 
                    formControlName="password"
                    placeholder="••••••••"
                    class="mvgr-input pr-12"
                  />
                  <button 
                    type="button" 
                    (click)="showPassword.set(!showPassword())"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span class="text-[10px]">{{ showPassword() ? 'HIDE' : 'SHOW' }}</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                [disabled]="isLoading() || loginForm.invalid"
                class="w-full mvgr-btn-primary justify-center py-2.5 disabled:opacity-50 text-xs">
                {{ isLoading() ? 'Verifying...' : 'Sign In to Portal →' }}
              </button>

              <div class="text-center pt-2">
                <span class="text-slate-500 text-[11px]">Don't have an account? </span>
                <a routerLink="/auth/register" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-[11px] transition-colors">
                  Create an account
                </a>
              </div>
            </form>

            <!-- 1-Click Quick Demo Accounts -->
            <div class="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                Quick Test Accounts (1-Click Fill):
              </span>
              <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                <button 
                  type="button" 
                  (click)="quickLogin('21CS001')"
                  class="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/5 text-left transition-all">
                  <div class="font-semibold text-slate-800 dark:text-slate-200 truncate">Arjun Sharma</div>
                  <div class="text-[10px] text-slate-400">21CS001 · CS</div>
                </button>
                <button 
                  type="button" 
                  (click)="quickLogin('22CS006')"
                  class="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/5 text-left transition-all">
                  <div class="font-semibold text-slate-800 dark:text-slate-200 truncate">Kavya Menon</div>
                  <div class="text-[10px] text-slate-400">22CS006 · CS</div>
                </button>
                <button 
                  type="button" 
                  (click)="quickLogin('21CI007')"
                  class="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/5 text-left transition-all">
                  <div class="font-semibold text-slate-800 dark:text-slate-200 truncate">Vikram Singh</div>
                  <div class="text-[10px] text-slate-400">21CI007 · IT</div>
                </button>
                <button 
                  type="button" 
                  (click)="quickLogin('21EC003')"
                  class="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/5 text-left transition-all">
                  <div class="font-semibold text-slate-800 dark:text-slate-200 truncate">Rohit Kumar</div>
                  <div class="text-[10px] text-slate-400">21EC003 · EC</div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  themeService = inject(ThemeService);

  isLoading = signal(false);
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    registrationNumber: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  quickLogin(regNumber: string): void {
    this.loginForm.patchValue({
      registrationNumber: regNumber,
      password: 'UniPulse@123'
    });
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { registrationNumber, password } = this.loginForm.value;

    this.authService.login(registrationNumber.trim().toUpperCase(), password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastService.success(`Welcome back, ${res.user.name}!`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error(err.error?.message || 'Invalid credentials');
      }
    });
  }
}
