import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-white/80 dark:bg-[#090d16]/90 border-t border-slate-200/80 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 mt-auto transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                M
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">UNIPULSE · MVGRCE</span>
                <span class="text-[10px] text-slate-500 font-mono">Maharaj Vijayaram Gajapathi Raj College of Engineering</span>
              </div>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Empowering students across CSE, ECE, EEE, MECH, CIVIL, IT, and Allied engineering branches with clubs, technical sprints, academic roadmaps, and peer collaboration.
            </p>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">Portal Shortcuts</h4>
            <ul class="space-y-2 text-xs">
              <li><a routerLink="/dashboard" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Student Dashboard</a></li>
              <li><a routerLink="/messages" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Campus Peer Chat</a></li>
              <li><a routerLink="/mvgr-hub" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-blue-600 dark:text-blue-400">MVGR Tools & CGPA Planner</a></li>
              <li><a routerLink="/clubs" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Campus Clubs (12)</a></li>
              <li><a routerLink="/events" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hackathons & Competitions</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">MVGR Campus</h4>
            <div class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p>📍 Vijayaram Nagar, Chintalavalasa, Vizianagaram, AP - 535005</p>
              <p>🌐 <a href="https://mvgrce.com" target="_blank" class="hover:underline text-blue-600 dark:text-blue-400">mvgrce.com</a> (Autonomous)</p>
              <p class="text-[11px] text-slate-500 mt-2 font-mono">
                Affiliated to JNTU-GV · Accredited by NAAC 'A' Grade
              </p>
            </div>
          </div>

        </div>

        <div class="pt-6 border-t border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Maharaj Vijayaram Gajapathi Raj College of Engineering. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Autonomous Systems & Chat Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
