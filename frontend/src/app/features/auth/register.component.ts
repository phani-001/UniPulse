import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';
import { FloatingObjectComponent } from '../../shared/components/floating-object/floating-object.component';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
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
        <div class="lg:col-span-6 space-y-6 hidden lg:block">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 text-xs font-mono font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            MVGRCE · STUDENT REGISTRATION
          </div>

          <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Create your account. <br/>
            Join the campus pulse. <br/>
            <span class="text-blue-600 dark:text-blue-400">Collaborate & excel.</span>
          </h1>

          <p class="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            Get instant access to club applications, hackathon registrations, peer messaging, and campus tools at Maharaj Vijayaram Gajapathi Raj College of Engineering.
          </p>

          <div class="pt-2 max-w-sm">
            <app-floating-object variant="compact" />
          </div>
        </div>

        <!-- Right Column: Minimalist Sign Up Card -->
        <div class="lg:col-span-6 w-full max-w-md mx-auto">
          <div class="mvgr-card p-8 space-y-5">
            
            <div>
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center mb-3 font-mono font-extrabold text-sm shadow-sm">
                M
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Create Student Account</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Fill out the details below to register your MVGR student profile.</p>
            </div>

            <!-- Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-3.5 text-xs font-mono">
              
              <!-- Full Name -->
              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Full Name <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  formControlName="name"
                  placeholder="e.g. Rahul Sharma"
                  class="mvgr-input"
                />
              </div>

              <!-- Registration Number -->
              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Registration Number <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  formControlName="registrationNumber"
                  placeholder="e.g. 23331A1285"
                  class="mvgr-input uppercase"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Email Address
                </label>
                <input 
                  type="email" 
                  formControlName="email"
                  placeholder="student@gmail.com"
                  class="mvgr-input lowercase"
                />
              </div>

              <!-- Branch & Year Grid -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Branch / Dept
                  </label>
                  <select 
                    formControlName="branch"
                    class="mvgr-input">
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Academic Year
                  </label>
                  <select 
                    formControlName="year"
                    class="mvgr-input">
                    <option [value]="1">1st Year</option>
                    <option [value]="2">2nd Year</option>
                    <option [value]="3">3rd Year</option>
                    <option [value]="4">4th Year</option>
                  </select>
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Password <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    [type]="showPassword() ? 'text' : 'password'" 
                    formControlName="password"
                    placeholder="Min 6 characters"
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

              <!-- Confirm Password -->
              <div>
                <label class="block uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                  Confirm Password <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="password" 
                  formControlName="confirmPassword"
                  placeholder="Repeat password"
                  class="mvgr-input"
                />
                @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
                  <p class="text-rose-500 text-[10px] mt-1 font-sans">Passwords do not match.</p>
                }
              </div>

              <button 
                type="submit" 
                [disabled]="isLoading() || registerForm.invalid"
                class="w-full mvgr-btn-primary justify-center py-2.5 mt-2 disabled:opacity-50 text-xs">
                {{ isLoading() ? 'Creating account...' : 'Create Account →' }}
              </button>
            </form>

            <!-- Already have an account link -->
            <div class="pt-4 border-t border-slate-100 dark:border-white/[0.06] text-center text-xs">
              <span class="text-slate-500">Already registered? </span>
              <a routerLink="/auth/login" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors">
                Sign in to your account
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  isLoading = signal(false);
  showPassword = signal(false);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    registrationNumber: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    branch: ['Computer Science'],
    year: [1],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const formVal = this.registerForm.value;

    const payload = {
      name: formVal.name.trim(),
      registrationNumber: formVal.registrationNumber.trim().toUpperCase(),
      email: formVal.email ? formVal.email.trim().toLowerCase() : undefined,
      branch: formVal.branch,
      year: Number(formVal.year),
      password: formVal.password
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastService.success(`Welcome to UniPulse, ${res.user.name}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error(err.error?.message || 'Registration failed. Please check your details.');
      }
    });
  }
}
