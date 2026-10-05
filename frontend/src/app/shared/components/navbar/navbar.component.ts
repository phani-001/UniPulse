import { Component, inject, signal, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MessageService } from '../../../core/services/message.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-[#090d16]/85 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Brand Logo & MVGR Identity -->
          <div class="flex items-center gap-6 lg:gap-8">
            <a routerLink="/dashboard" class="flex items-center gap-3 group">
              <!-- College Crest Shield Emblem -->
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform">
                <span>M</span>
              </div>
              
              <div class="flex flex-col">
                <span class="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  UNIPULSE
                  <span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50">
                    MVGRCE
                  </span>
                </span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                  AUTONOMOUS · VIZIANAGARAM
                </span>
              </div>
            </a>

            <!-- Desktop Navigation Links -->
            <nav class="hidden md:flex items-center gap-1">
              <a routerLink="/dashboard" routerLinkActive="bg-slate-100 dark:bg-white/[0.08] text-blue-600 dark:text-white font-semibold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all">
                Dashboard
              </a>

              <a routerLink="/clubs" routerLinkActive="bg-slate-100 dark:bg-white/[0.08] text-blue-600 dark:text-white font-semibold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
                <span>Clubs</span>
                <span class="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.2 rounded">12</span>
              </a>

              <a routerLink="/events" routerLinkActive="bg-slate-100 dark:bg-white/[0.08] text-blue-600 dark:text-white font-semibold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all">
                Hackathons & Events
              </a>

              <a routerLink="/results" routerLinkActive="bg-slate-100 dark:bg-white/[0.08] text-blue-600 dark:text-white font-semibold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all">
                Leaderboards
              </a>

              <a routerLink="/network" routerLinkActive="bg-slate-100 dark:bg-white/[0.08] text-blue-600 dark:text-white font-semibold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
                <span>Network</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </a>

              <!-- NEW: Peer Chat Messages Link -->
              <a routerLink="/messages" routerLinkActive="bg-slate-100 dark:bg-white/[0.08] text-blue-600 dark:text-white font-semibold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
                <span>Chat</span>
                @if (unreadMessages() > 0) {
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                    {{ unreadMessages() }}
                  </span>
                }
              </a>

              <!-- NEW: MVGR Campus Hub Link -->
              <a routerLink="/mvgr-hub" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold" 
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center gap-1">
                <span>🏛️</span>
                <span>MVGR Hub</span>
              </a>

              <!-- Live Database Inspector Link -->
              <a routerLink="/db-inspector" routerLinkActive="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold" 
                class="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live DB</span>
              </a>
            </nav>
          </div>

          <!-- Right: Controls & Profile -->
          <div class="flex items-center gap-2 sm:gap-3">
            
            <!-- THEME TOGGLE BUTTON -->
            <button 
              type="button" 
              (click)="themeService.toggleTheme()"
              class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'">
              @if (themeService.currentTheme() === 'dark') {
                <!-- Sun Icon -->
                <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              } @else {
                <!-- Moon Icon -->
                <svg class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            </button>

            <!-- Notifications Bell -->
            <div class="relative">
              <button 
                type="button" 
                (click)="toggleNotifications($event)"
                class="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                aria-label="Notifications">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                @if (unreadCount() > 0) {
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></span>
                }
              </button>

              @if (isNotificationsOpen()) {
                <div class="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 animate-fadeIn">
                  <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-black/30">
                    <span class="font-bold text-slate-900 dark:text-white text-xs">Notifications</span>
                    @if (unreadCount() > 0) {
                      <button (click)="markAllAsRead()" class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                        Mark all read
                      </button>
                    }
                  </div>
                  <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
                    @if (notifications().length === 0) {
                      <div class="p-6 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    } @else {
                      @for (n of notifications(); track n._id) {
                        <div (click)="onNotificationClick(n)" 
                          class="p-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer text-xs"
                          [ngClass]="{ 'bg-blue-50/50 dark:bg-blue-500/[0.05]': !n.isRead }">
                          <h4 class="font-semibold text-slate-900 dark:text-slate-200 truncate">{{ n.title }}</h4>
                          <p class="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">{{ n.message }}</p>
                          <span class="text-[10px] text-slate-400 dark:text-slate-600 font-mono mt-1 block">{{ n.createdAt | date:'shortTime' }}</span>
                        </div>
                      }
                    }
                  </div>
                </div>
              }
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button 
                type="button" 
                (click)="toggleUserMenu($event)"
                class="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all">
                <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-white/[0.08] border border-blue-200 dark:border-white/10 flex items-center justify-center font-bold text-blue-700 dark:text-white text-xs font-mono">
                  {{ userInitials() }}
                </div>
                <div class="hidden lg:block text-left">
                  <div class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{{ currentUser()?.name }}</div>
                  <div class="text-[10px] text-slate-500 font-mono">{{ currentUser()?.registrationNumber }}</div>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-400 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (isUserMenuOpen()) {
                <div class="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/10 shadow-2xl p-1.5 z-50 animate-fadeIn text-xs">
                  <div class="px-3 py-2 border-b border-slate-100 dark:border-white/[0.06] mb-1">
                    <p class="font-bold text-slate-900 dark:text-white">{{ currentUser()?.name }}</p>
                    <p class="text-[10px] font-mono text-slate-500">{{ currentUser()?.registrationNumber }} · {{ currentUser()?.branch || 'MVGR Student' }}</p>
                  </div>
                  <a routerLink="/profile" (click)="closeMenus()"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors">
                    Profile Settings
                  </a>
                  <a routerLink="/messages" (click)="closeMenus()"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors">
                    Peer Messages
                  </a>
                  <a routerLink="/mvgr-hub" (click)="closeMenus()"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
                    MVGR Campus Tools
                  </a>
                  <a routerLink="/db-inspector" (click)="closeMenus()"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors font-mono font-semibold">
                    <span>🟢</span> Live DB Inspector
                  </a>
                  <div class="border-t border-slate-100 dark:border-white/[0.06] my-1 pt-1">
                    <button (click)="logout()"
                      class="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Mobile Drawer Button -->
            <button 
              type="button" 
              (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
              class="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

          </div>

        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#090d16] px-4 py-3 space-y-1 text-xs">
          <a routerLink="/dashboard" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Dashboard</a>
          <a routerLink="/clubs" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Clubs (12)</a>
          <a routerLink="/events" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Hackathons & Events</a>
          <a routerLink="/results" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Leaderboard</a>
          <a routerLink="/network" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Student Network</a>
          <a routerLink="/messages" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Peer Messages</a>
          <a routerLink="/mvgr-hub" (click)="closeMenus()" class="block px-3 py-2 rounded-lg font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]">🏛️ MVGR Hub</a>
          <a routerLink="/db-inspector" (click)="closeMenus()" class="block px-3 py-2 rounded-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]">🟢 Live DB Inspector</a>
          <a routerLink="/profile" (click)="closeMenus()" class="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]">Profile</a>
          <button (click)="logout()" class="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400">Sign Out</button>
        </div>
      }
    </header>
  `
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  messageService = inject(MessageService);
  themeService = inject(ThemeService);
  router = inject(Router);
  private elementRef = inject(ElementRef);

  currentUser = this.authService.user;
  unreadCount = this.notificationService.unreadCount;
  unreadMessages = this.messageService.unreadCount;

  isNotificationsOpen = signal(false);
  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);
  notifications = signal<Notification[]>([]);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.fetchUnreadCount().subscribe({ error: () => {} });
      this.messageService.fetchUnreadCount().subscribe({ error: () => {} });
    }
  }

  userInitials(): string {
    const name = this.currentUser()?.name || '';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : (name[0] || 'U').toUpperCase();
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    const next = !this.isNotificationsOpen();
    this.closeMenus();
    if (next) {
      this.isNotificationsOpen.set(true);
      this.notificationService.getNotifications().subscribe(data => this.notifications.set(data));
    }
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    const next = !this.isUserMenuOpen();
    this.closeMenus();
    this.isUserMenuOpen.set(next);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
    });
  }

  onNotificationClick(n: Notification): void {
    if (!n.isRead) {
      this.notificationService.markAsRead(n._id).subscribe();
      this.notifications.update(list => list.map(item => item._id === n._id ? { ...item, isRead: true } : item));
    }
    if (n.link) {
      this.closeMenus();
      this.router.navigateByUrl(n.link);
    }
  }

  closeMenus(): void {
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenus();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenus();
    }
  }
}
