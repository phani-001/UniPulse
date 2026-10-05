import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { ToastService } from '../../core/services/toast.service';
import { Event } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScrollRevealDirective],
  template: `
    <div class="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      <!-- Back Button -->
      <div class="flex items-center justify-between">
        <a routerLink="/events" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events & Hackathons
        </a>
      </div>

      @if (event(); as ev) {
        
        <!-- Header Banner -->
        <div class="minimal-card p-8 sm:p-10 relative overflow-hidden appScrollReveal">
          <!-- Subtle Floating Background Orbs -->
          <div class="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
          <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-float-reverse"></div>

          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="px-2.5 py-0.5 text-[11px] font-medium uppercase rounded-md bg-white/[0.06] text-slate-300 border border-white/10">
                  {{ ev.type }}
                </span>
                <span class="px-2.5 py-0.5 text-[11px] font-medium uppercase rounded-md border"
                  [ngClass]="{
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': ev.status === 'upcoming',
                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20': ev.status === 'ongoing',
                    'bg-white/[0.04] text-slate-400 border-white/5': ev.status === 'completed'
                  }">
                  {{ ev.status }}
                </span>
                @if (isRegistered()) {
                  <span class="px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    ✓ You Are Registered
                  </span>
                }
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ ev.title }}</h1>
              
              <p class="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-3">
                <span>📍 {{ ev.venue }}</span>
                <span>·</span>
                <span>👥 {{ ev.registrationCount || 0 }} registered</span>
              </p>
            </div>

            <!-- Action Button -->
            <div>
              @if (isRegistered()) {
                <button 
                  type="button" 
                  (click)="cancelRegistration()"
                  [disabled]="isActionLoading()"
                  class="btn-minimal-secondary text-rose-400 hover:text-rose-300 hover:border-rose-500/30">
                  Withdraw Registration
                </button>
              } @else if (ev.status === 'upcoming') {
                <button 
                  type="button" 
                  (click)="showRegisterModal.set(true)"
                  class="btn-minimal-primary">
                  Register for Event
                </button>
              } @else {
                <span class="btn-minimal-secondary opacity-60 cursor-not-allowed">
                  Registration Closed
                </span>
              }
            </div>
          </div>
        </div>

        <!-- Two Column Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left 8 cols: Description & Prizes -->
          <div class="lg:col-span-8 space-y-6">
            
            <!-- Description -->
            <div class="minimal-card p-6 sm:p-8 space-y-3 appScrollReveal">
              <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Overview</h2>
              <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {{ ev.description }}
              </p>
            </div>

            <!-- Prizes Showcase if hackathon/competition -->
            @if (ev.prizes && ev.prizes.length > 0) {
              <div class="minimal-card p-6 sm:p-8 appScrollReveal">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span>🏆</span> Prize Pool & Rewards
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  @for (prize of ev.prizes; track prize.position) {
                    <div class="p-5 rounded-xl border text-center transition-all bg-white/[0.02]"
                      [ngClass]="{
                        'border-amber-500/30 bg-amber-500/[0.04]': prize.position === 1,
                        'border-white/10': prize.position === 2,
                        'border-white/5': prize.position === 3
                      }">
                      <div class="text-2xl mb-1.5">
                        {{ prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : '🥉' }}
                      </div>
                      <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {{ prize.position === 1 ? '1st Place' : prize.position === 2 ? '2nd Place' : '3rd Place' }}
                      </div>
                      <div class="text-xl font-extrabold text-white mt-1">
                        ₹{{ prize.amount?.toLocaleString() || prize.description }}
                      </div>
                      <p class="text-[11px] text-slate-400 mt-1">{{ prize.description }}</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Tags -->
            @if (ev.tags && ev.tags.length > 0) {
              <div class="flex items-center gap-2 flex-wrap appScrollReveal">
                <span class="text-xs text-slate-500 font-mono">Topics:</span>
                @for (tag of ev.tags; track tag) {
                  <span class="px-2.5 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400 font-mono">
                    #{{ tag }}
                  </span>
                }
              </div>
            }

          </div>

          <!-- Right 4 cols: Key Details & Format -->
          <div class="lg:col-span-4 space-y-6">
            
            <div class="minimal-card p-6 sm:p-8 space-y-5 appScrollReveal">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule & Details</h3>

              <div class="space-y-4 text-xs">
                <div class="flex items-start gap-3.5">
                  <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 text-sm">
                    📅
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Starts On</span>
                    <span class="font-medium text-white">{{ ev.startDate | date:'medium' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-3.5">
                  <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 text-sm">
                    🏁
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Ends On</span>
                    <span class="font-medium text-white">{{ ev.endDate | date:'medium' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-3.5">
                  <div class="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 text-sm">
                    ⏰
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Registration Deadline</span>
                    <span class="font-medium text-rose-300">{{ ev.registrationDeadline | date:'medium' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-3.5">
                  <div class="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 text-sm">
                    👥
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Format</span>
                    <span class="font-medium text-white">
                      @if (ev.teamSize.min === 1 && ev.teamSize.max === 1) {
                        Individual (Solo)
                      } @else {
                        Team ({{ ev.teamSize.min }} - {{ ev.teamSize.max }} members)
                      }
                    </span>
                  </div>
                </div>

                @if (ev.isOnline && ev.onlineLink) {
                  <div class="pt-2">
                    <a [href]="ev.onlineLink" target="_blank" class="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-semibold text-center border border-white/10 flex items-center justify-center gap-2 transition-all">
                      <span>Launch Online Room</span>
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                }
              </div>

            </div>

            <!-- Team Finder Shortcut -->
            @if (ev.teamSize.max > 1) {
              <div class="minimal-card p-6 text-center space-y-3 appScrollReveal">
                <div class="text-xs font-bold text-white">Need Teammates for This Event?</div>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  Post on the UniPulse Team Finder board to match with students having complementary technical skills.
                </p>
                <a [routerLink]="['/network']" [queryParams]="{ eventId: ev._id }" 
                  class="btn-minimal-secondary text-xs inline-flex">
                  Find or Post Teammates →
                </a>
              </div>
            }

          </div>

        </div>

      } @else {
        <div class="p-16 text-center text-slate-500 font-mono text-xs">
          Loading event details...
        </div>
      }

      <!-- Registration Modal -->
      @if (showRegisterModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl relative">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Register: {{ event()?.title }}</h3>
              <button (click)="showRegisterModal.set(false)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              @if (event()?.teamSize?.max! > 1) {
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                    Team Name *
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="teamName"
                    placeholder="e.g. CodeWarriors"
                    class="mvgr-input"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                    Teammate Registration Numbers
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="teammatesInput"
                    placeholder="e.g. 21CS005, 22CS006"
                    class="mvgr-input uppercase font-mono"
                  />
                  <p class="text-[10px] text-slate-400 mt-1 font-mono">Separate registration numbers with commas.</p>
                </div>
              } @else {
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Solo registration confirmation. You'll receive real-time schedule and submission notifications.
                </div>
              }

              <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/[0.06]">
                <button 
                  type="button" 
                  (click)="showRegisterModal.set(false)"
                  class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  [disabled]="isActionLoading()"
                  (click)="confirmRegistration()"
                  class="mvgr-btn-primary text-xs disabled:opacity-50">
                  {{ isActionLoading() ? 'Registering...' : 'Confirm Registration' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private toastService = inject(ToastService);

  event = signal<Event | null>(null);
  isRegistered = signal(false);
  isActionLoading = signal(false);
  showRegisterModal = signal(false);

  teamName = '';
  teammatesInput = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEvent(id).subscribe({
      next: (data) => {
        this.event.set(data);
        if (data.registrationStatus === 'registered') {
          this.isRegistered.set(true);
        }
      },
      error: () => this.toastService.error('Could not load event details')
    });
  }

  confirmRegistration(): void {
    const ev = this.event();
    if (!ev) return;

    this.isActionLoading.set(true);
    const payload: any = {};
    if (ev.teamSize.max > 1) {
      if (this.teamName.trim()) payload.teamName = this.teamName.trim();
      if (this.teammatesInput.trim()) {
        payload.teamMembers = this.teammatesInput.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      }
    }

    this.eventService.registerForEvent(ev._id, payload).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.showRegisterModal.set(false);
        this.isRegistered.set(true);
        this.toastService.success(`Registered for ${ev.title}!`);
        this.loadEvent(ev._id);
      },
      error: (err) => {
        this.isActionLoading.set(false);
        this.toastService.error(err.error?.message || 'Registration failed');
      }
    });
  }

  cancelRegistration(): void {
    const ev = this.event();
    if (!ev) return;

    if (!confirm('Are you sure you want to withdraw your registration?')) return;

    this.isActionLoading.set(true);
    this.eventService.cancelRegistration(ev._id).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.isRegistered.set(false);
        this.toastService.info('Your registration has been cancelled');
        this.loadEvent(ev._id);
      },
      error: (err) => {
        this.isActionLoading.set(false);
        this.toastService.error(err.error?.message || 'Could not cancel registration');
      }
    });
  }
}
