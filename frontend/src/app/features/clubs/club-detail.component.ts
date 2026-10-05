import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../../core/services/club.service';
import { ToastService } from '../../core/services/toast.service';
import { Club } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScrollRevealDirective],
  template: `
    <div class="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      <!-- Back Button -->
      <div class="flex items-center justify-between">
        <a routerLink="/clubs" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Clubs Directory
        </a>
      </div>

      @if (club(); as c) {
        
        <!-- Hero Header -->
        <div class="minimal-card p-8 sm:p-10 relative overflow-hidden appScrollReveal">
          <!-- Subtle Floating Background Orbs -->
          <div class="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
          <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-float-reverse"></div>

          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-start sm:items-center gap-6">
              <div class="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-extrabold text-white text-3xl shadow-2xl flex-shrink-0">
                {{ c.name.charAt(0) }}
              </div>
              <div>
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-md bg-white/[0.06] text-slate-300 border border-white/10">
                    {{ c.category }}
                  </span>
                  @if (c.membershipStatus === 'active' || isMember()) {
                    <span class="px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      ✓ Active Member
                    </span>
                  }
                  @if (c.applicationStatus === 'pending') {
                    <span class="px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      ⏳ Review Pending
                    </span>
                  }
                </div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ c.name }}</h1>
                <p class="text-xs sm:text-sm text-slate-400 mt-1">
                  {{ c.memberCount }} Registered Members · Founded {{ c.foundedYear || 2021 }}
                </p>
              </div>
            </div>

            <!-- Action Button -->
            <div>
              @if (c.membershipStatus === 'active' || isMember()) {
                <button 
                  type="button" 
                  (click)="leaveClub()"
                  [disabled]="isActionLoading()"
                  class="btn-minimal-secondary text-rose-400 hover:text-rose-300 hover:border-rose-500/30">
                  {{ isActionLoading() ? 'Leaving...' : 'Leave Club' }}
                </button>
              } @else if (c.applicationStatus === 'pending') {
                <button 
                  type="button" 
                  disabled
                  class="btn-minimal-secondary opacity-60 cursor-not-allowed">
                  Application Under Review
                </button>
              } @else {
                <button 
                  type="button" 
                  (click)="showApplyModal.set(true)"
                  class="btn-minimal-primary">
                  Apply to Join Club
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left 8 cols: About & Objectives -->
          <div class="lg:col-span-8 space-y-6">
            <div class="minimal-card p-6 sm:p-8 space-y-4 appScrollReveal">
              <h2 class="text-base font-bold text-white tracking-tight uppercase tracking-wider text-xs text-slate-400">About the Club</h2>
              <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {{ c.description }}
              </p>
            </div>

            <!-- Social Links / Campus Presence -->
            @if (c.socialLinks) {
              <div class="minimal-card p-6 sm:p-8 appScrollReveal">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Official Channels</h3>
                <div class="flex items-center gap-3">
                  @if (c.socialLinks.website) {
                    <a [href]="c.socialLinks.website" target="_blank" class="btn-minimal-secondary text-xs">
                      <span>Official Portal</span>
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  }
                  @if (c.socialLinks.instagram) {
                    <a [href]="'https://instagram.com/' + c.socialLinks.instagram" target="_blank" class="btn-minimal-secondary text-xs">
                      <span>Instagram (&#64;{{ c.socialLinks.instagram }})</span>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Right 4 cols: Coordinators -->
          <div class="lg:col-span-4 space-y-6">
            <div class="minimal-card p-6 sm:p-8 appScrollReveal">
              <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5 font-mono">Student Coordinators</h3>
              
              <div class="space-y-3">
                @for (coord of c.coordinators; track coord.user?._id) {
                  <div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                    <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                      {{ coord.user?.name?.charAt(0) || 'C' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate">{{ coord.user?.name }}</h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{{ coord.user?.registrationNumber }} · {{ coord.user?.branch }}</p>
                      <span class="inline-block mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase font-mono">
                        {{ coord.role || 'Coordinator' }}
                      </span>
                    </div>
                  </div>
                }
                @if (!c.coordinators || c.coordinators.length === 0) {
                  <p class="text-xs text-slate-500">No designated coordinators listed.</p>
                }
              </div>
            </div>
          </div>

        </div>

      } @else {
        <div class="p-16 text-center text-slate-500 font-mono text-xs">
          Loading club details...
        </div>
      }

      <!-- Apply Modal -->
      @if (showApplyModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl relative">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Join {{ club()?.name }}</h3>
              <button (click)="showApplyModal.set(false)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Statement of Interest / Why do you want to join? *
                </label>
                <textarea 
                  [(ngModel)]="applyReason"
                  rows="4"
                  placeholder="Share your interests, prior work, or what you hope to contribute..."
                  class="mvgr-input"></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Skills & Technical Stack
                </label>
                <input 
                  type="text" 
                  [(ngModel)]="applySkills"
                  placeholder="e.g. JavaScript, ML, UI Design, Robotics"
                  class="mvgr-input"
                />
              </div>

              <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/[0.06]">
                <button 
                  type="button" 
                  (click)="showApplyModal.set(false)"
                  class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  [disabled]="isActionLoading() || !applyReason.trim()"
                  (click)="submitApplication()"
                  class="mvgr-btn-primary text-xs disabled:opacity-50">
                  {{ isActionLoading() ? 'Submitting...' : 'Submit Application' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ClubDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clubService = inject(ClubService);
  private toastService = inject(ToastService);

  club = signal<Club | null>(null);
  isMember = signal(false);
  isActionLoading = signal(false);
  showApplyModal = signal(false);

  applyReason = '';
  applySkills = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClub(id);
    }
  }

  loadClub(id: string): void {
    this.clubService.getClub(id).subscribe({
      next: (data) => {
        this.club.set(data);
        if (data.isMember || data.membershipStatus === 'active') {
          this.isMember.set(true);
        }
      },
      error: () => this.toastService.error('Could not load club details')
    });
  }

  leaveClub(): void {
    const c = this.club();
    if (!c) return;

    if (!confirm(`Are you sure you want to leave ${c.name}?`)) return;

    this.isActionLoading.set(true);
    this.clubService.leaveClub(c._id).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.isMember.set(false);
        this.toastService.success(`You have left ${c.name}`);
        this.loadClub(c._id);
      },
      error: (err) => {
        this.isActionLoading.set(false);
        this.toastService.error(err.error?.message || 'Could not leave club');
      }
    });
  }

  submitApplication(): void {
    const c = this.club();
    if (!c || !this.applyReason.trim()) return;

    this.isActionLoading.set(true);
    this.clubService.applyToClub(c._id, this.applyReason.trim(), this.applySkills.trim()).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.showApplyModal.set(false);
        this.toastService.success('Your application has been submitted to the coordinators!');
        this.loadClub(c._id);
      },
      error: (err) => {
        this.isActionLoading.set(false);
        this.toastService.error(err.error?.message || 'Application failed');
      }
    });
  }
}
