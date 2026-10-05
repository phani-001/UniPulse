import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { ToastService } from '../../core/services/toast.service';
import { Event, EventRegistration } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScrollRevealDirective],
  template: `
    <div class="space-y-10">
      
      <!-- Page Header -->
      <div appScrollReveal class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.06] pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-mono mb-2">
            ⚡ MVGR HACKATHONS · WORKSHOPS · COMPETITIONS
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Events & Hackathons</h1>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Compete for cash bounties, solve real-world problems, and represent MVGR engineering departments.
          </p>
        </div>

        <!-- View Switcher -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono">
          <button 
            type="button"
            (click)="activeTab.set('all')"
            [ngClass]="activeTab() === 'all' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            All Events ({{ events().length }})
          </button>
          <button 
            type="button"
            (click)="activeTab.set('my')"
            [ngClass]="activeTab() === 'my' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            My Registrations ({{ myRegistrations().length }})
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div appScrollReveal revealDelay="delay-1" class="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search events by name or tags..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
          />
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none text-xs font-mono">
          @for (t of eventTypes; track t) {
            <button 
              type="button"
              (click)="selectedType.set(t)"
              [ngClass]="selectedType() === t ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 rounded-lg capitalize transition-all">
              {{ t }}
            </button>
          }
        </div>
      </div>

      <!-- Events Grid with Scroll Reveal -->
      @if (activeTab() === 'all') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (ev of filteredEvents(); track ev._id; let idx = $index) {
            <div 
              appScrollReveal 
              [revealDelay]="'delay-' + ((idx % 3) + 1)"
              class="minimal-card p-6 flex flex-col justify-between group">
              
              <div>
                <div class="flex items-center justify-between gap-2 mb-3 font-mono">
                  <span class="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50">
                    {{ ev.type }}
                  </span>
                  <span class="text-[11px] text-slate-500">
                    {{ ev.startDate | date:'MMM d, y' }}
                  </span>
                </div>

                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
                  {{ ev.title }}
                </h3>

                <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {{ ev.description }}
                </p>

                <!-- Details List -->
                <div class="space-y-1.5 py-3 border-y border-slate-100 dark:border-white/[0.06] text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <div class="flex items-center justify-between">
                    <span>Venue</span>
                    <span class="text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{{ ev.venue }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Format</span>
                    <span class="text-slate-800 dark:text-slate-200">
                      {{ ev.teamSize.max > 1 ? 'Team (' + ev.teamSize.min + '–' + ev.teamSize.max + ')' : 'Solo' }}
                    </span>
                  </div>
                  @if (ev.prizes && ev.prizes.length > 0) {
                    <div class="flex items-center justify-between text-amber-600 dark:text-amber-400 pt-1 font-bold">
                      <span>Top Prize</span>
                      <span>₹{{ ev.prizes[0].amount?.toLocaleString() || ev.prizes[0].description }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="mt-5 flex items-center gap-2.5">
                <a [routerLink]="['/events', ev._id]" 
                  class="flex-1 py-2 px-3 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-medium text-center border border-slate-200 dark:border-white/[0.06] transition-all">
                  Event Brief
                </a>
                @if (isRegistered(ev._id)) {
                  <span class="py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium border border-emerald-200 dark:border-emerald-500/20">
                    ✓ Registered
                  </span>
                } @else if (ev.status === 'upcoming') {
                  <button 
                    type="button" 
                    (click)="openRegisterModal(ev)"
                    class="mvgr-btn-primary py-2 px-3.5 text-xs whitespace-nowrap shadow-sm">
                    Register
                  </button>
                }
              </div>

            </div>
          }
        </div>
      } @else {
        
        <!-- My Registrations List -->
        <div class="space-y-4">
          @for (reg of myRegistrations(); track reg._id) {
            <div class="minimal-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span class="px-2 py-0.5 uppercase rounded bg-white/[0.05] text-slate-300">{{ reg.event.type }}</span>
                  <span>Registered {{ reg.registeredAt | date:'mediumDate' }}</span>
                </div>
                <h3 class="text-sm font-bold text-white">{{ reg.event.title }}</h3>
                <p class="text-xs text-slate-400">
                  📍 {{ reg.event.venue }} · 📅 {{ reg.event.startDate | date:'medium' }}
                </p>
                @if (reg.teamName) {
                  <p class="text-xs text-indigo-400 font-mono">Team: {{ reg.teamName }}</p>
                }
              </div>

              <div class="flex items-center gap-3">
                <a [routerLink]="['/events', reg.event._id]" class="btn-minimal-secondary text-xs">
                  View Brief
                </a>
                <button (click)="cancelRegistration(reg.event._id)" class="text-xs text-rose-400 hover:underline px-2">
                  Withdraw
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Registration Modal -->
      @if (selectedEventToRegister()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/10 p-6 shadow-2xl relative space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Register for {{ selectedEventToRegister()?.title }}</h3>
                <p class="text-[11px] text-slate-500 font-mono mt-0.5">
                  {{ selectedEventToRegister()?.teamSize?.max! > 1 ? 'Team Entry' : 'Individual Solo Entry' }}
                </p>
              </div>
              <button (click)="selectedEventToRegister.set(null)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              @if (selectedEventToRegister()?.teamSize?.max! > 1) {
                <div>
                  <label class="block font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1 font-semibold">Team Name *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="teamName"
                    placeholder="e.g. ApexDevelopers"
                    class="mvgr-input"
                  />
                </div>

                <div>
                  <label class="block font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    Teammate Registration Numbers (Comma separated)
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="teammatesInput"
                    placeholder="21CS005, 22CS006"
                    class="mvgr-input uppercase font-mono"
                  />
                </div>
              } @else {
                <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You are confirming single-participant registration. You'll receive real-time updates regarding challenge briefs.
                </p>
              }

              <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <button (click)="selectedEventToRegister.set(null)" class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  [disabled]="isRegistering()"
                  (click)="confirmRegistration()"
                  class="mvgr-btn-primary text-xs disabled:opacity-50">
                  {{ isRegistering() ? 'Registering...' : 'Confirm Registration' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class EventListComponent implements OnInit {
  eventService = inject(EventService);
  toastService = inject(ToastService);

  events = signal<Event[]>([]);
  myRegistrations = signal<EventRegistration[]>([]);
  activeTab = signal<'all' | 'my'>('all');
  selectedType = signal<string>('all');
  searchQuery = '';

  eventTypes: string[] = ['all', 'hackathon', 'workshop', 'competition', 'cultural', 'sports'];

  selectedEventToRegister = signal<Event | null>(null);
  teamName = '';
  teammatesInput = '';
  isRegistering = signal(false);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents({ limit: 50 }).subscribe({
      next: (events) => this.events.set(events),
      error: () => {}
    });

    this.eventService.getMyRegistrations().subscribe({
      next: (regs) => this.myRegistrations.set(regs),
      error: () => {}
    });
  }

  isRegistered(eventId: string): boolean {
    return this.myRegistrations().some(r => r.event._id === eventId);
  }

  filteredEvents(): Event[] {
    return this.events().filter(ev => {
      const matchType = this.selectedType() === 'all' || ev.type === this.selectedType();
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        ev.title.toLowerCase().includes(q) ||
        (ev.description && ev.description.toLowerCase().includes(q));
      return matchType && matchSearch;
    });
  }

  openRegisterModal(ev: Event): void {
    this.selectedEventToRegister.set(ev);
    this.teamName = '';
    this.teammatesInput = '';
  }

  confirmRegistration(): void {
    const ev = this.selectedEventToRegister();
    if (!ev) return;

    this.isRegistering.set(true);
    const payload: any = {};
    if (ev.teamSize.max > 1) {
      if (this.teamName.trim()) payload.teamName = this.teamName.trim();
      if (this.teammatesInput.trim()) {
        payload.teamMembers = this.teammatesInput.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      }
    }

    this.eventService.registerForEvent(ev._id, payload).subscribe({
      next: () => {
        this.isRegistering.set(false);
        this.selectedEventToRegister.set(null);
        this.toastService.success(`Registered for ${ev.title}!`);
        this.loadEvents();
      },
      error: (err) => {
        this.isRegistering.set(false);
        this.toastService.error(err.error?.message || 'Registration failed');
      }
    });
  }

  cancelRegistration(eventId: string): void {
    if (!confirm('Are you sure you want to withdraw registration?')) return;

    this.eventService.cancelRegistration(eventId).subscribe({
      next: () => {
        this.toastService.info('Registration withdrawn');
        this.loadEvents();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Could not withdraw')
    });
  }
}
