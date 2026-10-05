import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { ConnectionService } from '../../core/services/connection.service';
import { TeamPostService } from '../../core/services/team-post.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { User, Connection, TeamPost } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-network',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ScrollRevealDirective],
  template: `
    <div class="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            MVGRCE · STUDENT DIRECTORY
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Network & Teams</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with MVGR peers, find complementary skills, and assemble hackathon teams
          </p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium">
          <button 
            type="button"
            (click)="activeTab.set('directory')"
            [ngClass]="activeTab() === 'directory' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-2 rounded-lg transition-all">
            Directory
          </button>
          <button 
            type="button"
            (click)="activeTab.set('team-finder')"
            [ngClass]="activeTab() === 'team-finder' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-2 rounded-lg transition-all">
            Team-Up ({{ teamPosts().length }})
          </button>
          <button 
            type="button"
            (click)="activeTab.set('connections')"
            [ngClass]="activeTab() === 'connections' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="px-4 py-2 rounded-lg transition-all relative">
            Connected Peers
            @if (incomingRequests().length > 0) {
              <span class="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {{ incomingRequests().length }}
              </span>
            }
          </button>
        </div>
      </div>

      <!-- 1. STUDENT DIRECTORY -->
      @if (activeTab() === 'directory') {
        <div class="space-y-6">
          
          <!-- Search & Filters -->
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="relative w-full md:w-80">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                [(ngModel)]="searchDirectoryQuery" 
                placeholder="Search by name, skills, reg no..."
                class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <!-- Branch Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              @for (b of branches; track b) {
                <button 
                  type="button"
                  (click)="selectedBranch.set(b)"
                  [ngClass]="selectedBranch() === b ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white'"
                  class="px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all">
                  {{ b }}
                </button>
              }
            </div>
          </div>

          <!-- Students Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (student of filteredStudents(); track student._id; let idx = $index) {
              <div class="mvgr-card p-6 flex flex-col justify-between appScrollReveal delay-{{ (idx % 5) + 1 }}">
                <div>
                  
                  <!-- Student Avatar & Name -->
                  <div class="flex items-start gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-base flex-shrink-0">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ student.name }}</h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{ student.registrationNumber }}</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ student.branch }} · Yr {{ student.year }}</p>
                    </div>
                  </div>

                  <!-- Bio -->
                  @if (student.bio) {
                    <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {{ student.bio }}
                    </p>
                  }

                  <!-- Skills Tags -->
                  <div class="py-3 border-t border-slate-100 dark:border-white/[0.06]">
                    <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 font-mono">
                      Skills:
                    </span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (skill of student.skills?.slice(0, 4); track skill) {
                        <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                          {{ skill }}
                        </span>
                      }
                      @if ((student.skills?.length || 0) > 4) {
                        <span class="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{{ student.skills.length - 4 }}
                        </span>
                      }
                    </div>
                  </div>

                </div>

                <!-- Footer Action -->
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ⚡ {{ student.points || 0 }} pts
                  </span>

                  @if (student._id === currentUserId()) {
                    <span class="text-xs text-slate-400 font-mono">You</span>
                  } @else if (isPeerConnected(student._id)) {
                    <a [routerLink]="['/messages']" [queryParams]="{ peer: student._id }"
                      class="mvgr-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat
                    </a>
                  } @else {
                    <button 
                      type="button" 
                      (click)="openConnectModal(student)"
                      class="mvgr-btn-secondary text-xs py-1.5 px-3">
                      Connect
                    </button>
                  }
                </div>

              </div>
            }
          </div>

        </div>
      }

      <!-- 2. TEAM-UP BOARD -->
      @if (activeTab() === 'team-finder') {
        <div class="space-y-6">
          <div class="mvgr-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 appScrollReveal">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Hackathon Team Matchmaker</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Find co-developers, designers, and AI specialists for upcoming university hackathons.
              </p>
            </div>
            <button 
              type="button" 
              (click)="showCreateTeamPostModal.set(true)"
              class="mvgr-btn-primary whitespace-nowrap">
              + Post Requirement
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            @for (post of teamPosts(); track post._id; let idx = $index) {
              <div class="mvgr-card p-6 flex flex-col justify-between appScrollReveal delay-{{ (idx % 4) + 1 }}">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="px-2.5 py-0.5 text-[10px] font-medium uppercase rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/50">
                      {{ post.event?.title || 'Open Hackathon' }}
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">
                      {{ post.createdAt | date:'MMM d' }}
                    </span>
                  </div>

                  <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2">{{ post.title }}</h3>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                    {{ post.description }}
                  </p>

                  <!-- Skills Needed Chips -->
                  <div class="space-y-2 py-3 border-t border-slate-100 dark:border-white/[0.06]">
                    <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-mono">
                      Required Roles:
                    </span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (s of post.skillsNeeded; track s) {
                        <span class="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                          {{ s }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Author Info -->
                  <div class="flex items-center gap-3 pt-3 text-xs text-slate-500 dark:text-slate-400">
                    <div class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-[10px]">
                      {{ (post.author || post.creator)?.name?.charAt(0) || 'U' }}
                    </div>
                    <span>Created by <strong class="text-slate-900 dark:text-white">{{ (post.author || post.creator)?.name }}</strong></span>
                  </div>
                </div>

                <!-- Footer Action -->
                <div class="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <span class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Team: {{ post.teamSize?.current || 1 }} / {{ post.teamSize?.needed || 4 }}
                  </span>
                  
                  @if ((post.author || post.creator)?._id !== currentUserId()) {
                    <button 
                      type="button" 
                      (click)="openRespondModal(post)"
                      class="mvgr-btn-primary text-xs py-1.5 px-3.5">
                      Join Team
                    </button>
                  } @else {
                    <span class="text-xs text-slate-400 font-mono">Your Post</span>
                  }
                </div>
              </div>
            }
          </div>

          @if (teamPosts().length === 0) {
            <div class="p-16 text-center text-slate-400 font-mono text-xs mvgr-card">
              No active team recruitment posts yet.
            </div>
          }
        </div>
      }

      <!-- 3. MY CONNECTION REQUESTS & PEERS -->
      @if (activeTab() === 'connections') {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Incoming Requests -->
          <div class="mvgr-card p-6 space-y-4 appScrollReveal">
            <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Incoming Requests ({{ incomingRequests().length }})</h3>
            
            <div class="space-y-3">
              @for (req of incomingRequests(); track req._id) {
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                      {{ req.requester?.name?.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ req.requester?.name }}</h4>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{{ req.requester?.registrationNumber }} · {{ req.requester?.branch }}</p>
                      @if (req.note) {
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">"{{ req.note }}"</p>
                      }
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      (click)="respondRequest(req._id, 'accept')"
                      class="mvgr-btn-primary text-xs py-1.5 px-3">
                      Accept
                    </button>
                    <button 
                      type="button" 
                      (click)="respondRequest(req._id, 'reject')"
                      class="mvgr-btn-secondary text-xs py-1.5 px-3">
                      Decline
                    </button>
                  </div>
                </div>
              }
              @if (incomingRequests().length === 0) {
                <p class="text-xs text-slate-400 text-center py-6 font-mono">No pending requests.</p>
              }
            </div>
          </div>

          <!-- Active Connections List -->
          <div class="mvgr-card p-6 space-y-4 appScrollReveal">
            <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Connected Peers ({{ myConnections().length }})</h3>

            <div class="space-y-3">
              @for (conn of myConnections(); track conn._id) {
                @let otherUser = (conn.requester._id === currentUserId() ? conn.recipient : conn.requester);
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                      {{ otherUser?.name?.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white">{{ otherUser?.name }}</h4>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{{ otherUser?.registrationNumber }} · {{ otherUser?.branch }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 text-[10px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Connected
                    </span>
                    <a [routerLink]="['/messages']" [queryParams]="{ peer: otherUser?._id }"
                      class="mvgr-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat
                    </a>
                  </div>
                </div>
              }
              @if (myConnections().length === 0) {
                <p class="text-xs text-slate-400 text-center py-6 font-mono">No connections established yet.</p>
              }
            </div>
          </div>

        </div>
      }

      <!-- Connect Request Modal -->
      @if (selectedStudentToConnect()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl relative">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Connect with {{ selectedStudentToConnect()?.name }}</h3>
              <button (click)="selectedStudentToConnect.set(null)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Personal Note (Optional)
                </label>
                <textarea 
                  [(ngModel)]="connectNote"
                  rows="3"
                  placeholder="Share a short intro or reasons for connecting..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-colors"></textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  (click)="selectedStudentToConnect.set(null)"
                  class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  (click)="sendConnectRequest()"
                  class="mvgr-btn-primary text-xs">
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Create Team Post Modal -->
      @if (showCreateTeamPostModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl relative">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Post Team Requirement</h3>
              <button (click)="showCreateTeamPostModal.set(false)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">Post Title *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newPostTitle"
                  placeholder="e.g. Looking for Full-Stack & ML Developers"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">Description *</label>
                <textarea 
                  [(ngModel)]="newPostDesc"
                  rows="3"
                  placeholder="Describe your hackathon idea, what you've started, and who you're looking for..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"></textarea>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">Skills Needed (Comma separated) *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newPostSkills"
                  placeholder="e.g. React, Node.js, ML, Figma"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-mono">Total Team Size Needed</label>
                <input 
                  type="number" 
                  [(ngModel)]="newPostTeamSize"
                  min="2"
                  max="6"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div class="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  (click)="showCreateTeamPostModal.set(false)"
                  class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  [disabled]="!newPostTitle.trim() || !newPostDesc.trim()"
                  (click)="submitTeamPost()"
                  class="mvgr-btn-primary text-xs disabled:opacity-50">
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Reach Out Modal -->
      @if (selectedPostToReachOut()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl relative">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Reach Out to {{ (selectedPostToReachOut()?.author || selectedPostToReachOut()?.creator)?.name }}</h3>
              <button (click)="selectedPostToReachOut.set(null)" class="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Message / Highlights *
                </label>
                <textarea 
                  [(ngModel)]="reachOutMessage"
                  rows="3"
                  placeholder="Hey, I'd like to join your team! Here is my background..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-colors"></textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  (click)="selectedPostToReachOut.set(null)"
                  class="mvgr-btn-secondary text-xs">
                  Cancel
                </button>
                <button 
                  type="button" 
                  [disabled]="!reachOutMessage.trim()"
                  (click)="sendReachOut()"
                  class="mvgr-btn-primary text-xs disabled:opacity-50">
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class NetworkComponent implements OnInit {
  profileService = inject(ProfileService);
  connectionService = inject(ConnectionService);
  teamPostService = inject(TeamPostService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);

  activeTab = signal<'directory' | 'team-finder' | 'connections'>('directory');
  students = signal<User[]>([]);
  teamPosts = signal<TeamPost[]>([]);
  incomingRequests = signal<Connection[]>([]);
  myConnections = signal<Connection[]>([]);

  searchDirectoryQuery = '';
  selectedBranch = signal<string>('All');
  branches = ['All', 'Computer Science', 'Information Technology', 'Electronics', 'Electrical Engineering', 'Mechanical'];

  currentUserId = signal<string>('');

  selectedStudentToConnect = signal<User | null>(null);
  connectNote = '';

  showCreateTeamPostModal = signal(false);
  newPostTitle = '';
  newPostDesc = '';
  newPostSkills = '';
  newPostTeamSize = 4;

  selectedPostToReachOut = signal<TeamPost | null>(null);
  reachOutMessage = '';

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.currentUserId.set(user._id);
    }

    this.route.queryParams.subscribe(params => {
      if (params['eventId']) {
        this.activeTab.set('team-finder');
      }
    });

    this.loadDirectory();
    this.loadTeamPosts();
    this.loadConnections();
  }

  isPeerConnected(userId: string): boolean {
    return this.myConnections().some(c => {
      const reqId = typeof c.requester === 'object' ? c.requester._id : c.requester;
      const recId = typeof c.recipient === 'object' ? c.recipient._id : c.recipient;
      return (reqId === userId || recId === userId);
    });
  }

  loadDirectory(): void {
    this.profileService.discoverStudents().subscribe({
      next: (students) => this.students.set(students),
      error: () => {}
    });
  }

  loadTeamPosts(): void {
    this.teamPostService.getTeamPosts().subscribe({
      next: (posts) => this.teamPosts.set(posts),
      error: () => {}
    });
  }

  loadConnections(): void {
    this.connectionService.getIncomingRequests().subscribe({
      next: (res) => this.incomingRequests.set(res),
      error: () => {}
    });

    this.connectionService.getMyConnections().subscribe({
      next: (res) => this.myConnections.set(res),
      error: () => {}
    });
  }

  filteredStudents(): User[] {
    return this.students().filter(s => {
      const matchBranch = this.selectedBranch() === 'All' || s.branch === this.selectedBranch();
      const q = this.searchDirectoryQuery.toLowerCase().trim();
      const matchQuery = !q ||
        s.name.toLowerCase().includes(q) ||
        s.registrationNumber.toLowerCase().includes(q) ||
        s.skills.some(sk => sk.toLowerCase().includes(q));
      return matchBranch && matchQuery;
    });
  }

  openConnectModal(student: User): void {
    this.selectedStudentToConnect.set(student);
    this.connectNote = '';
  }

  sendConnectRequest(): void {
    const target = this.selectedStudentToConnect();
    if (!target) return;

    this.connectionService.sendRequest(target._id, this.connectNote.trim()).subscribe({
      next: () => {
        this.toastService.success(`Connection request sent to ${target.name}!`);
        this.selectedStudentToConnect.set(null);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not send request');
      }
    });
  }

  respondRequest(id: string, action: 'accept' | 'reject'): void {
    this.connectionService.respondToRequest(id, action).subscribe({
      next: () => {
        this.toastService.success(`Request ${action}ed`);
        this.loadConnections();
      },
      error: () => this.toastService.error('Action failed')
    });
  }

  submitTeamPost(): void {
    if (!this.newPostTitle.trim() || !this.newPostDesc.trim()) return;

    const skills = this.newPostSkills.split(',').map(s => s.trim()).filter(Boolean);

    this.teamPostService.createTeamPost({
      title: this.newPostTitle.trim(),
      description: this.newPostDesc.trim(),
      skillsNeeded: skills,
      teamSize: { needed: this.newPostTeamSize, current: 1 }
    }).subscribe({
      next: () => {
        this.toastService.success('Your team requirement has been posted to the board!');
        this.showCreateTeamPostModal.set(false);
        this.newPostTitle = '';
        this.newPostDesc = '';
        this.newPostSkills = '';
        this.loadTeamPosts();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not create post');
      }
    });
  }

  openRespondModal(post: TeamPost): void {
    this.selectedPostToReachOut.set(post);
    this.reachOutMessage = '';
  }

  sendReachOut(): void {
    const post = this.selectedPostToReachOut();
    if (!post || !this.reachOutMessage.trim()) return;

    this.teamPostService.respondToTeamPost(post._id, this.reachOutMessage.trim()).subscribe({
      next: () => {
        this.toastService.success('Your message was sent to the team creator!');
        this.selectedPostToReachOut.set(null);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to send message');
      }
    });
  }
}
