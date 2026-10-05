import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClubService } from '../../core/services/club.service';
import { EventService } from '../../core/services/event.service';
import { AnnouncementService } from '../../core/services/announcement.service';
import { ConnectionService } from '../../core/services/connection.service';
import { MessageService } from '../../core/services/message.service';
import { Club, Event, Announcement } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  template: `
    <div class="space-y-10 animate-fadeIn">
      
      <!-- Institutional Hero Header for MVGR College of Engineering -->
      <section appScrollReveal class="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-blue-900/10 via-slate-50 to-indigo-900/10 dark:from-blue-950/40 dark:via-[#0c101d] dark:to-indigo-950/30 transition-colors duration-200">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left Text Content -->
          <div class="lg:col-span-8 space-y-4">
            
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 text-xs font-mono font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ greeting() }} · {{ currentUser()?.registrationNumber }} · MVGRCE
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {{ currentUser()?.name }}
            </h1>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              <strong>Maharaj Vijayaram Gajapathi Raj College of Engineering</strong> (Autonomous). 
              Department of {{ currentUser()?.branch || 'Computer Science' }}, Year {{ currentUser()?.year || 1 }}. Connected to 12 campus organizations, technical sprints, and peer collaborators.
            </p>

            <div class="pt-3 flex flex-wrap items-center gap-3">
              <a routerLink="/messages" class="mvgr-btn-primary">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Peer Messages
                @if (unreadMessages() > 0) {
                  <span class="ml-1 px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px] font-bold">
                    {{ unreadMessages() }}
                  </span>
                }
              </a>

              <a routerLink="/mvgr-hub" class="mvgr-btn-secondary">
                <span>🏛️</span>
                MVGR Tools & CGPA Planner
              </a>

              <a routerLink="/events" class="mvgr-btn-secondary">
                <span>⚡</span>
                Browse Hackathons
              </a>
            </div>

          </div>

          <!-- Right Column: Institutional Identity Card -->
          <div class="lg:col-span-4 hidden lg:block">
            <div class="p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-sm space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                  MVGR
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white leading-tight">MVGR College of Engg.</h4>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Autonomous · JNTU-GV</p>
                </div>
              </div>

              <div class="border-t border-slate-100 dark:border-white/[0.06] pt-3 space-y-2 text-xs font-mono">
                <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span class="text-slate-400">Curriculum:</span>
                  <span class="font-bold">R20 / R23</span>
                </div>
                <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span class="text-slate-400">Accreditation:</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">NAAC 'A' Grade</span>
                </div>
                <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span class="text-slate-400">Campus:</span>
                  <span>Vizianagaram, AP</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Institutional Metrics Bar -->
      <section appScrollReveal revealDelay="delay-1" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="mvgr-card p-5">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-mono uppercase tracking-wider text-[11px]">Clubs Joined</span>
            <span class="text-slate-400 font-mono">01</span>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {{ myClubs().length }}
          </div>
          <a routerLink="/clubs" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1 transition-colors">
            Manage memberships →
          </a>
        </div>

        <div class="mvgr-card p-5">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-mono uppercase tracking-wider text-[11px]">Events Registered</span>
            <span class="text-slate-400 font-mono">02</span>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {{ registeredCount() }}
          </div>
          <a routerLink="/events" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1 transition-colors">
            View schedule →
          </a>
        </div>

        <div class="mvgr-card p-5">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-mono uppercase tracking-wider text-[11px]">Pulse Points</span>
            <span class="text-slate-400 font-mono">03</span>
          </div>
          <div class="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-2 font-mono">
            ⚡ {{ currentUser()?.points || 0 }}
          </div>
          <a routerLink="/results" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1 transition-colors">
            Leaderboard standings →
          </a>
        </div>

        <div class="mvgr-card p-5">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-mono uppercase tracking-wider text-[11px]">Peer Network</span>
            <span class="text-slate-400 font-mono">04</span>
          </div>
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {{ connectionCount() }}
          </div>
          <a routerLink="/network" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1 transition-colors">
            Connect with peers →
          </a>
        </div>

      </section>

      <!-- Main Columns: Featured Hackathons & Live Announcements -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left 8 cols: Hackathons Spotlight & Clubs -->
        <div class="lg:col-span-8 space-y-8">
          
          <div appScrollReveal revealDelay="delay-2" class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Hackathons & Competitions</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upcoming technical sprints opening for MVGR student teams</p>
            </div>
            <a routerLink="/events" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
              View all ({{ upcomingEvents().length }}) →
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (ev of upcomingEvents().slice(0, 4); track ev._id; let idx = $index) {
              <div appScrollReveal [revealDelay]="'delay-' + (idx + 1)" class="mvgr-card p-5 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50">
                      {{ ev.type }}
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">
                      {{ ev.startDate | date:'MMM d' }}
                    </span>
                  </div>

                  <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{{ ev.title }}</h3>
                  <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{{ ev.description }}</p>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <div class="text-[11px] text-slate-500 truncate max-w-[140px]">
                    📍 {{ ev.venue }}
                  </div>
                  <a [routerLink]="['/events', ev._id]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                    Details →
                  </a>
                </div>
              </div>
            }
          </div>

          <!-- My Clubs Quick Section -->
          <div appScrollReveal revealDelay="delay-3" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">My Active Clubs</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Campus organizations where you hold confirmed membership</p>
              </div>
              <a routerLink="/clubs" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                Browse all 12 clubs →
              </a>
            </div>

            @if (myClubs().length === 0) {
              <div class="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 text-center">
                <p class="text-xs text-slate-700 dark:text-slate-300 font-medium">No club memberships registered yet.</p>
                <p class="text-[11px] text-slate-500 mt-1">Explore CodeCraft, FYFP, Swecha MVGR, InnovatAI, RoboPulse and more!</p>
                <a routerLink="/clubs" class="inline-block mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                  Join a Club
                </a>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (c of myClubs(); track c._id) {
                  <a [routerLink]="['/clubs', c._id]" class="mvgr-card p-4 flex items-center gap-3.5 group">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs font-mono shrink-0">
                      {{ c.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{{ c.name }}</h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ c.category }} · {{ c.memberCount }} members</p>
                    </div>
                    <span class="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                      Active
                    </span>
                  </a>
                }
              </div>
            }
          </div>

        </div>

        <!-- Right 4 cols: Live Announcements & Campus Shortcuts -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Live Campus Wire -->
          <div appScrollReveal revealDelay="delay-3" class="mvgr-card p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <span class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Campus Announcements</span>
              <span class="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE
              </span>
            </div>

            <div class="space-y-3">
              @for (ann of announcements().slice(0, 5); track ann._id) {
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-[9px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">{{ ann.type }}</span>
                    <span class="text-[10px] text-slate-400 font-mono">{{ ann.createdAt | date:'MMM d' }}</span>
                  </div>
                  <h4 class="text-xs font-semibold text-slate-900 dark:text-white leading-snug">{{ ann.title }}</h4>
                  <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{{ ann.content }}</p>
                </div>
              }
            </div>
          </div>

          <!-- MVGR Hub Banner Shortcut -->
          <div appScrollReveal revealDelay="delay-4" class="mvgr-card p-5 space-y-3 border-l-4 border-l-blue-600">
            <div class="flex items-center gap-2">
              <span class="text-lg">🏛️</span>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">MVGR Campus Hub</h4>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculate R20/R23 semester SGPA, target your dream CGPA, and view Autonomous Exam Cell shortcuts.
            </p>
            <a routerLink="/mvgr-hub" class="w-full mvgr-btn-secondary text-center justify-center text-xs">
              Open Academic Tools →
            </a>
          </div>

        </div>

      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  clubService = inject(ClubService);
  eventService = inject(EventService);
  announcementService = inject(AnnouncementService);
  connectionService = inject(ConnectionService);
  messageService = inject(MessageService);

  currentUser = this.authService.user;
  unreadMessages = this.messageService.unreadCount;

  myClubs = signal<Club[]>([]);
  upcomingEvents = signal<Event[]>([]);
  announcements = signal<Announcement[]>([]);
  connectionCount = signal<number>(0);
  registeredCount = signal<number>(0);

  ngOnInit(): void {
    this.loadData();
    this.messageService.fetchUnreadCount().subscribe();
  }

  greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  loadData(): void {
    this.clubService.getMyClubs().subscribe({
      next: (clubs) => this.myClubs.set(clubs),
      error: () => {}
    });

    this.eventService.getEvents({ status: 'upcoming' }).subscribe({
      next: (events) => this.upcomingEvents.set(events),
      error: () => {}
    });

    this.announcementService.getAnnouncements().subscribe({
      next: (res) => this.announcements.set(res.announcements),
      error: () => {}
    });

    this.connectionService.getMyConnections().subscribe({
      next: (conns) => this.connectionCount.set(conns.length),
      error: () => {}
    });

    this.eventService.getMyRegistrations().subscribe({
      next: (regs) => this.registeredCount.set(regs.length),
      error: () => {}
    });
  }
}
