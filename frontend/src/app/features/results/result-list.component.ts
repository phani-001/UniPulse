import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResultService, StudentLeaderboardEntry, ClubLeaderboardEntry } from '../../core/services/result.service';
import { Result } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  template: `
    <div class="space-y-10">
      
      <!-- Page Header -->
      <div appScrollReveal class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.06] pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono mb-2">
            🏆 MVGR HALL OF FAME · RANKINGS
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Leaderboards & Competition Results</h1>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Weekly hackathon victory podiums, top MVGR student innovators, and official club rankings.
          </p>
        </div>

        <!-- View Switcher -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs font-mono">
          <button 
            type="button"
            (click)="activeTab.set('weekly')"
            [ngClass]="activeTab() === 'weekly' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            Weekly Winners
          </button>
          <button 
            type="button"
            (click)="activeTab.set('students')"
            [ngClass]="activeTab() === 'students' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            Student Leaderboard
          </button>
          <button 
            type="button"
            (click)="activeTab.set('clubs')"
            [ngClass]="activeTab() === 'clubs' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-1.5 rounded-lg transition-all">
            Club Standings
          </button>
        </div>
      </div>

      <!-- 1. Weekly Winners View -->
      @if (activeTab() === 'weekly') {
        <div class="space-y-8">
          @for (res of weeklyResults(); track res._id; let rIdx = $index) {
            <div appScrollReveal [revealDelay]="'delay-' + ((rIdx % 2) + 1)" class="minimal-card p-6 sm:p-8 space-y-6">
              
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                <div>
                  <div class="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <span class="px-2 py-0.5 rounded bg-blue-50 dark:bg-white/[0.05] text-blue-700 dark:text-slate-300 font-bold">WEEK {{ res.week }}</span>
                    <span>{{ res.weekStart | date:'MMM d' }} – {{ res.weekEnd | date:'MMM d, y' }}</span>
                  </div>
                  <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1.5">{{ res.event.title }}</h2>
                </div>

                <a [routerLink]="['/events', res.event._id]" class="text-xs font-mono text-blue-600 dark:text-slate-400 hover:underline transition-colors">
                  Competition Archive →
                </a>
              </div>

              <!-- Podiums Grid (1st, 2nd, 3rd) -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                @for (pos of res.positions; track pos.position) {
                  <div class="rounded-xl border p-5 flex flex-col justify-between"
                    [ngClass]="{
                      'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30': pos.position === 1,
                      'bg-slate-50 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700/50': pos.position === 2,
                      'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30': pos.position === 3
                    }">
                    
                    <div>
                      <div class="flex items-center justify-between mb-3 font-mono">
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          {{ pos.position === 1 ? '🥇 1st Place' : pos.position === 2 ? '🥈 2nd Place' : '🥉 3rd Place' }}
                        </span>
                        <span class="text-[10px] text-blue-700 dark:text-indigo-400 bg-blue-100 dark:bg-indigo-500/10 px-2 py-0.5 rounded font-bold">
                          +{{ pos.points }} pts
                        </span>
                      </div>

                      <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {{ pos.winners[0]?.user?.name || pos.winners[0]?.name || pos.teamName || 'Winner' }}
                      </h3>

                      @if (pos.club?.name) {
                        <p class="text-[11px] font-mono text-slate-500 mt-1">
                          Affiliation: {{ pos.club?.name }}
                        </p>
                      }

                      <!-- Honorees -->
                      @if (pos.winners && pos.winners.length > 0) {
                        <div class="mt-4 pt-3 border-t border-white/[0.06]">
                          <span class="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                            Team Members
                          </span>
                          <div class="flex flex-wrap gap-1">
                            @for (w of pos.winners; track w.user?._id || w.name) {
                              <span class="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-300 border border-white/5">
                                {{ w.user?.name || w.name }}
                              </span>
                            }
                          </div>
                        </div>
                      }
                    </div>

                    <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                      <span class="text-slate-500">Prize</span>
                      <span class="text-white font-semibold">{{ pos.prize || ('+' + pos.points + ' Points') }}</span>
                    </div>

                  </div>
                }
              </div>

            </div>
          }
        </div>
      }

      <!-- 2. Student Leaderboard View -->
      @if (activeTab() === 'students') {
        <div appScrollReveal class="mvgr-card overflow-hidden">
          <div class="p-6 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">MVGR Student Rankings</h2>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Rankings calculated from verified hackathon wins and technical initiatives</p>
            </div>
            <span class="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-semibold">
              ● Live Campus Standings
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-white/[0.06] text-[10px] font-mono uppercase text-slate-500 bg-slate-50 dark:bg-white/[0.01]">
                  <th class="py-3 px-6 w-16">Rank</th>
                  <th class="py-3 px-6">Student</th>
                  <th class="py-3 px-6">Department</th>
                  <th class="py-3 px-6">Recognition</th>
                  <th class="py-3 px-6 text-right font-mono">Points</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.04]">
                @for (student of studentLeaderboard(); track student._id; let idx = $index) {
                  <tr class="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td class="py-3.5 px-6 font-mono font-bold">
                      <span [ngClass]="idx < 3 ? 'text-blue-600 dark:text-white font-extrabold' : 'text-slate-400'">
                        {{ idx < 3 ? (idx === 0 ? '01' : idx === 1 ? '02' : '03') : '#' + (idx + 1) }}
                      </span>
                    </td>
                    <td class="py-3.5 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center font-mono text-xs font-bold text-slate-800 dark:text-white">
                          {{ student.name.charAt(0) }}
                        </div>
                        <div>
                          <div class="font-bold text-slate-900 dark:text-white">{{ student.name }}</div>
                          <div class="text-[10px] text-slate-500 font-mono">{{ student.registrationNumber }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-6 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {{ student.branch }} · Yr {{ student.year }}
                    </td>
                    <td class="py-3.5 px-6 font-mono text-[11px]">
                      @if (idx === 0) {
                        <span class="text-amber-600 dark:text-amber-400 font-bold">Campus Grandmaster</span>
                      } @else if (idx === 1) {
                        <span class="text-blue-600 dark:text-indigo-400 font-semibold">Hackathon Lead</span>
                      } @else {
                        <span class="text-slate-500 dark:text-slate-400">Technical Achiever</span>
                      }
                    </td>
                    <td class="py-3.5 px-6 text-right font-mono font-bold text-slate-900 dark:text-slate-200">
                      {{ student.points }} pts
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- 3. Club Standings View -->
      @if (activeTab() === 'clubs') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (club of clubLeaderboard(); track club._id; let idx = $index) {
            <div appScrollReveal [revealDelay]="'delay-' + ((idx % 3) + 1)" class="mvgr-card p-6 flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-4 font-mono text-xs">
                  <span class="font-bold text-slate-400">#0{{ idx + 1 }}</span>
                  <span class="text-[10px] uppercase text-slate-500">{{ club.category }}</span>
                </div>

                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center font-mono font-bold text-slate-800 dark:text-white">
                    {{ club.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ club.name }}</h3>
                    <p class="text-[11px] font-mono text-slate-500">{{ club.winsCount || 0 }} Event Victories</p>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500">Total Score</span>
                <span class="text-white font-bold">{{ club.totalPoints || 0 }} pts</span>
              </div>
            </div>
          }
        </div>
      }

    </div>
  `
})
export class ResultListComponent implements OnInit {
  resultService = inject(ResultService);

  activeTab = signal<'weekly' | 'students' | 'clubs'>('weekly');
  weeklyResults = signal<Result[]>([]);
  studentLeaderboard = signal<StudentLeaderboardEntry[]>([]);
  clubLeaderboard = signal<ClubLeaderboardEntry[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.resultService.getWeeklyResults().subscribe({
      next: (res) => this.weeklyResults.set(res),
      error: () => {}
    });

    this.resultService.getStudentLeaderboard().subscribe({
      next: (res) => this.studentLeaderboard.set(res),
      error: () => {}
    });

    this.resultService.getClubLeaderboard().subscribe({
      next: (res) => this.clubLeaderboard.set(res),
      error: () => {}
    });
  }
}
