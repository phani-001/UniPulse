import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 lg:p-8 relative">
      <div class="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Security Check</h2>
          <p class="text-xs text-slate-400 mt-1">
            Please set a new secure password for your account to replace the college default password.
          </p>
        </div>

        <form [formGroup]="pwdForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input 
              type="password" 
              formControlName="currentPassword"
              placeholder="e.g. UniPulse@123"
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input 
              type="password" 
              formControlName="newPassword"
              placeholder="Minimum 6 characters"
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input 
              type="password" 
              formControlName="confirmPassword"
              placeholder="Re-type new password"
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <button 
              type="submit" 
              [disabled]="isLoading() || pwdForm.invalid"
              class="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50">
              {{ isLoading() ? 'Updating Password...' : 'Update Password' }}
            </button>

            <button 
              type="button" 
              (click)="skipForNow()"
              class="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors">
              Skip for now → Proceed to Dashboard
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);

  pwdForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.pwdForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } = this.pwdForm.value;
    if (newPassword !== confirmPassword) {
      this.toastService.error('New passwords do not match', 'Validation Error');
      return;
    }

    this.isLoading.set(true);
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Your password has been updated securely!', 'Password Changed');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error(err.error?.message || 'Failed to update password', 'Error');
      }
    });
  }

  skipForNow(): void {
    this.router.navigate(['/dashboard']);
  }
}
