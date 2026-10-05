import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../../core/services/club.service';
import { ToastService } from '../../core/services/toast.service';
import { Club } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScrollRevealDirective],
  template: `
    <div class="space-y-10">
      
      <!-- Page Header with Scroll Reveal -->
      <div appScrollReveal class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.06] pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-mono mb-2">
            MVGR CAMPUS ORGANIZATIONS · {{ clubs().length }} ACTIVE CLUBS
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Campus Clubs Directory</h1>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Discover student-led engineering, open source, cultural, and sports societies across MVGRCE.
          </p>
        </div>

        <!-- Tab Toggle (All vs My Clubs) -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono">
          <button 
            type="button"
            (click)="activeTab.set('all')"
            [ngClass]="activeTab() === 'all' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            All Clubs ({{ clubs().length }})
          </button>
          <button 
            type="button"
            (click)="activeTab.set('my')"
            [ngClass]="activeTab() === 'my' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            My Memberships ({{ myClubs().length }})
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div appScrollReveal revealDelay="delay-1" class="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <!-- Search Input -->
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search 12 clubs by title or keywords..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
          />
        </div>

        <!-- Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none text-xs font-mono">
          @for (cat of categories; track cat) {
            <button 
              type="button"
              (click)="selectCategory(cat)"
              [ngClass]="selectedCategory() === cat ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all">
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Clubs Grid with Scroll Reveal -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (club of displayedClubs(); track club._id; let idx = $index) {
          <div 
            appScrollReveal 
            [revealDelay]="'delay-' + ((idx % 3) + 1)"
            class="minimal-card p-6 flex flex-col justify-between group">
            
            <div>
              <!-- Card Header -->
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-base font-mono flex-shrink-0">
                    {{ club.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {{ club.name }}
                    </h3>
                    <span class="text-[11px] font-mono text-slate-500">
                      {{ club.category }} · Est. {{ club.foundedYear || 2020 }}
                    </span>
                  </div>
                </div>

                @if (isUserMember(club._id)) {
                  <span class="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                    Member
                  </span>
                }
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-5">
                {{ club.description }}
              </p>

              <!-- Metrics -->
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 py-3 border-y border-slate-100 dark:border-white/[0.06]">
                <span>Members: <strong class="text-slate-800 dark:text-slate-200">{{ club.memberCount || 0 }}</strong></span>
                <span>Active Chapter</span>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="mt-5 flex items-center gap-2.5">
              <a [routerLink]="['/clubs', club._id]" 
                class="flex-1 py-2 px-3 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-medium text-center border border-slate-200 dark:border-white/[0.06] transition-all">
                Club Details
              </a>
              @if (!isUserMember(club._id)) {
                <button 
                  type="button" 
                  (click)="openApplyModal(club)"
                  class="mvgr-btn-primary py-2 px-3.5 text-xs whitespace-nowrap shadow-sm">
                  Apply to Join
                </button>
              }
            </div>

          </div>
        }
      </div>

      @if (displayedClubs().length === 0) {
        <div class="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center max-w-md mx-auto">
          <p class="text-xs font-semibold text-white">No clubs found</p>
          <p class="text-xs text-slate-500 mt-1">Try selecting a different category or clearing your search filter.</p>
        </div>
      }

      <!-- Apply Modal -->
      @if (selectedClubToApply()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/10 p-6 shadow-2xl relative space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">Apply to {{ selectedClubToApply()?.name }}</h3>
                <p class="text-[11px] text-slate-500 font-mono mt-0.5">Submit member application</p>
              </div>
              <button (click)="selectedClubToApply.set(null)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  Why do you want to join? *
                </label>
                <textarea 
                  [(ngModel)]="applyReason"
                  rows="3"
                  placeholder="Share your interest in this club's projects and activities..."
                  class="mvgr-input"></textarea>
              </div>

              <div>
                <label class="block font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  Relevant Skills / Background
                </label>
                <input 
                  type="text" 
                  [(ngModel)]="applySkills"
                  placeholder="e.g. Python, UI Design, Embedded Systems, Debate"
                  class="mvgr-input"
                />
              </div>

              <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <button (click)="selectedClubToApply.set(null)" class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  [disabled]="isApplying() || !applyReason.trim()"
                  (click)="submitApplication()"
                  class="mvgr-btn-primary text-xs disabled:opacity-50">
                  {{ isApplying() ? 'Submitting...' : 'Send Application' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ClubListComponent implements OnInit {
  clubService = inject(ClubService);
  toastService = inject(ToastService);

  clubs = signal<Club[]>([]);
  myClubs = signal<Club[]>([]);
  activeTab = signal<'all' | 'my'>('all');
  selectedCategory = signal<string>('All');
  searchQuery = '';

  categories: string[] = ['All', 'Tech', 'Cultural', 'Sports', 'Academic', 'Arts', 'Social'];

  selectedClubToApply = signal<Club | null>(null);
  applyReason = '';
  applySkills = '';
  isApplying = signal(false);

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubs({ limit: 50 }).subscribe({
      next: (clubs) => this.clubs.set(clubs),
      error: () => {}
    });

    this.clubService.getMyClubs().subscribe({
      next: (myClubs) => this.myClubs.set(myClubs),
      error: () => {}
    });
  }

  isUserMember(clubId: string): boolean {
    return this.myClubs().some(c => c._id === clubId);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  displayedClubs(): Club[] {
    const list = this.activeTab() === 'my' ? this.myClubs() : this.clubs();
    return list.filter(c => {
      const matchCat = this.selectedCategory() === 'All' || c.category === this.selectedCategory();
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }

  openApplyModal(club: Club): void {
    this.selectedClubToApply.set(club);
    this.applyReason = '';
    this.applySkills = '';
  }

  submitApplication(): void {
    const club = this.selectedClubToApply();
    if (!club || !this.applyReason.trim()) return;

    this.isApplying.set(true);
    this.clubService.applyToClub(club._id, this.applyReason.trim(), this.applySkills.trim()).subscribe({
      next: () => {
        this.isApplying.set(false);
        this.toastService.success(`Application sent to ${club.name}!`);
        this.selectedClubToApply.set(null);
      },
      error: (err) => {
        this.isApplying.set(false);
        this.toastService.error(err.error?.message || 'Could not send application');
      }
    });
  }
}
