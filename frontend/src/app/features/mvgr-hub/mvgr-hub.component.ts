import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface CourseSubject {
  name: string;
  credits: number;
  grade: string;
}

@Component({
  selector: 'app-mvgr-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-10 max-w-7xl mx-auto animate-fadeIn pb-12">
      
      <!-- Institutional College Header Banner -->
      <div class="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-white/10 bg-gradient-to-br from-blue-900/10 via-slate-50 to-indigo-900/10 dark:from-blue-950/40 dark:via-[#0c101d] dark:to-indigo-950/30">
        
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 text-xs font-mono font-semibold">
              <span>🏛️</span>
              AUTONOMOUS · NAAC 'A' GRADE · ESTD 1997
            </div>
            
            <h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Maharaj Vijayaram Gajapathi Raj
              <span class="block text-blue-600 dark:text-blue-400">College of Engineering</span>
            </h1>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Vijayaram Nagar Campus, Chintalavalasa, Vizianagaram, AP. Comprehensive academic tools, grade planning, and campus student resources.
            </p>
          </div>

          <!-- Fast Stat Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto font-mono">
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-center">
              <span class="text-[10px] text-slate-500 uppercase block">Curriculum</span>
              <span class="text-base font-bold text-slate-900 dark:text-white">R20 / R23</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-center">
              <span class="text-[10px] text-slate-500 uppercase block">Affiliation</span>
              <span class="text-base font-bold text-slate-900 dark:text-white">JNTU-GV</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-center col-span-2 sm:col-span-1">
              <span class="text-[10px] text-slate-500 uppercase block">Clubs & Chapters</span>
              <span class="text-base font-bold text-blue-600 dark:text-blue-400">12 Active</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Navigation Tabs for Tools -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button 
          type="button" 
          (click)="activeSection.set('cgpa')"
          [ngClass]="activeSection() === 'cgpa' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          class="px-4 py-2 text-xs sm:text-sm transition-all flex items-center gap-2">
          <span>📊</span>
          <span>R20/R23 SGPA & CGPA Planner</span>
        </button>

        <button 
          type="button" 
          (click)="activeSection.set('links')"
          [ngClass]="activeSection() === 'links' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          class="px-4 py-2 text-xs sm:text-sm transition-all flex items-center gap-2">
          <span>🔗</span>
          <span>Campus Shortcuts & Exam Cell</span>
        </button>

        <button 
          type="button" 
          (click)="activeSection.set('chapters')"
          [ngClass]="activeSection() === 'chapters' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
          class="px-4 py-2 text-xs sm:text-sm transition-all flex items-center gap-2">
          <span>👥</span>
          <span>MVGR Student Chapters (FYFP & Swecha)</span>
        </button>
      </div>

      <!-- SECTION 1: SGPA & CGPA PLANNER -->
      @if (activeSection() === 'cgpa') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Subject Input Table (7 cols) -->
          <div class="lg:col-span-7 mvgr-card p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Semester Grade Calculator</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Based on MVGR Autonomous 10-point scale</p>
              </div>
              <button 
                type="button" 
                (click)="addSubject()"
                class="mvgr-btn-secondary text-xs py-1.5 px-3">
                + Add Course
              </button>
            </div>

            <!-- Subject Rows -->
            <div class="space-y-3">
              @for (sub of subjects(); track $index; let i = $index) {
                <div class="grid grid-cols-12 gap-2.5 items-center p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs">
                  
                  <div class="col-span-6">
                    <input 
                      type="text" 
                      [(ngModel)]="sub.name" 
                      placeholder="Course Name (e.g. DBMS)"
                      class="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div class="col-span-3">
                    <select 
                      [(ngModel)]="sub.grade" 
                      class="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono">
                      <option value="O">O (10)</option>
                      <option value="A+">A+ (9)</option>
                      <option value="A">A (8)</option>
                      <option value="B+">B+ (7)</option>
                      <option value="B">B (6)</option>
                      <option value="C">C (5)</option>
                      <option value="F">F (0)</option>
                    </select>
                  </div>

                  <div class="col-span-2">
                    <select 
                      [(ngModel)]="sub.credits" 
                      class="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono">
                      <option [ngValue]="4">4 Cr</option>
                      <option [ngValue]="3">3 Cr</option>
                      <option [ngValue]="2">2 Cr</option>
                      <option [ngValue]="1.5">1.5 Cr</option>
                      <option [ngValue]="1">1 Cr</option>
                    </select>
                  </div>

                  <div class="col-span-1 text-center">
                    @if (subjects().length > 1) {
                      <button 
                        type="button" 
                        (click)="removeSubject(i)"
                        class="text-slate-400 hover:text-rose-500 transition-colors">
                        ✕
                      </button>
                    }
                  </div>

                </div>
              }
            </div>

            <!-- Grade Point Legend -->
            <div class="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">O = 10 (Outstanding)</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">A+ = 9 (Excellent)</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">A = 8 (Very Good)</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">B+ = 7 (Good)</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">B = 6 (Fair)</span>
            </div>

          </div>

          <!-- Calculated Results & CGPA Goal Planner (5 cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- Result Card -->
            <div class="mvgr-card p-6 sm:p-8 text-center space-y-4">
              <span class="text-xs uppercase font-mono tracking-wider text-slate-500 block">
                Estimated SGPA
              </span>

              <div class="text-5xl sm:text-6xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {{ calculateSGPA() }}
              </div>

              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-xs font-mono text-slate-600 dark:text-slate-300">
                <span>Total Credits: <strong>{{ totalCredits() }}</strong></span>
                <span>·</span>
                <span>Grade Points: <strong>{{ totalPoints() }}</strong></span>
              </div>

              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                @if (calculateSGPA() >= 8.5) {
                  🌟 Outstanding academic performance! First Class with Distinction eligibility.
                } @else if (calculateSGPA() >= 7.0) {
                  👍 Solid First Class standing for campus recruitment & technical internships.
                } @else {
                  🎯 Focus on core engineering subjects to boost your overall GPA above 7.5.
                }
              </p>
            </div>

            <!-- Goal Planner -->
            <div class="mvgr-card p-6 space-y-4">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Target CGPA Roadmapper
              </h4>

              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-[11px] text-slate-500 mb-1">Current CGPA</label>
                  <input 
                    type="number" 
                    [(ngModel)]="currentCGPA" 
                    step="0.01" 
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label class="block text-[11px] text-slate-500 mb-1">Target CGPA</label>
                  <input 
                    type="number" 
                    [(ngModel)]="targetCGPA" 
                    step="0.01" 
                    class="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-900 dark:text-blue-200">
                To achieve your target of <strong>{{ targetCGPA }}</strong>, aim for an average of <strong>{{ getRequiredAvg() }}</strong> in your upcoming semesters.
              </div>
            </div>

          </div>

        </div>
      }

      <!-- SECTION 2: CAMPUS SHORTCUTS & EXAM CELL -->
      @if (activeSection() === 'links') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="mvgr-card p-6 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
              📝
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Autonomous Exam Cell</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Official circulars for End Semester Examination timetables, revaluation results, and hall tickets.
            </p>
            <a href="https://mvgrce.com" target="_blank" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
              Visit Exam Portal →
            </a>
          </div>

          <div class="mvgr-card p-6 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              📚
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Central Library & OPAC</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Access digital book search, IEEE Xplore, ScienceDirect research papers, and NPTEL local video mirror.
            </p>
            <a href="https://mvgrce.com" target="_blank" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
              Access Digital Library →
            </a>
          </div>

          <div class="mvgr-card p-6 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              🚌
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Campus Bus Routes</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Daily college transit schedules connecting Visakhapatnam (RTC Complex, Gajuwaka), Vizianagaram, and Srikakulam.
            </p>
            <span class="text-xs font-mono text-slate-400">Routes 1–28 Active</span>
          </div>

          <div class="mvgr-card p-6 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
              💡
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">IIC & TBI Incubator</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              MVGR Technology Business Incubator and MSME Idea Hackathon hub for aspiring student founders.
            </p>
            <a routerLink="/clubs" class="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1">
              Explore E-Cell Club →
            </a>
          </div>

          <div class="mvgr-card p-6 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              💻
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Central Computing Facility (CCF)</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              High-speed internet labs, cloud servers, and competitive programming practice arenas open till 7:00 PM.
            </p>
            <span class="text-xs font-mono text-slate-400">Labs 1 to 8 Available</span>
          </div>

          <div class="mvgr-card p-6 space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
              🛡️
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Anti-Ragging & Student Grievance</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Strict UGC zero-tolerance campus. 24x7 Student Support cell and faculty mentor contact points.
            </p>
            <span class="text-xs font-mono text-rose-500 font-semibold">Toll Free: 1800-425-6847</span>
          </div>

        </div>
      }

      <!-- SECTION 3: STUDENT CHAPTERS (FYFP & SWECHA) -->
      @if (activeSection() === 'chapters') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- FYFP -->
          <div class="mvgr-card p-6 sm:p-8 space-y-4 border-l-4 border-l-rose-500">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 font-bold">
                Flagship Social Welfare
              </span>
              <span class="text-xs font-mono text-slate-400">Estd. at MVGR</span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 dark:text-white">FYFP (For You For People)</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              MVGR's most celebrated student humanitarian organization. Leads blood donation drives, rural education outreach, book donation campaigns, and environmental drives in and around Vizianagaram.
            </p>

            <div class="flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
              <span class="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05]">🩸 Blood Donation</span>
              <span class="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05]">🌱 Green Vizag</span>
              <span class="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05]">📖 School Outreach</span>
            </div>

            <div class="pt-2">
              <a routerLink="/clubs" class="mvgr-btn-primary text-xs">
                View Club Details & Join →
              </a>
            </div>
          </div>

          <!-- SWECHA MVGR -->
          <div class="mvgr-card p-6 sm:p-8 space-y-4 border-l-4 border-l-cyan-500">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 font-bold">
                Open Source & Tech
              </span>
              <span class="text-xs font-mono text-slate-400">Student Chapter</span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Swecha MVGR Chapter</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Promoting Free and Open Source Software (FOSS), GNU/Linux adoption, Wikipedia localization, and technical skill enhancement workshops for rural engineering schools.
            </p>

            <div class="flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
              <span class="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05]">🐧 GNU/Linux</span>
              <span class="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05]">⚡ Python & AI</span>
              <span class="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.05]">🌐 Open Web</span>
            </div>

            <div class="pt-2">
              <a routerLink="/events" class="mvgr-btn-primary text-xs">
                Attend Upcoming Tech Workshops →
              </a>
            </div>
          </div>

        </div>
      }

    </div>
  `
})
export class MvgrHubComponent {
  activeSection = signal<'cgpa' | 'links' | 'chapters'>('cgpa');

  currentCGPA = 8.12;
  targetCGPA = 8.5;

  subjects = signal<CourseSubject[]>([
    { name: 'Data Structures & Algorithms', credits: 4, grade: 'O' },
    { name: 'Database Management Systems', credits: 4, grade: 'A+' },
    { name: 'Computer Networks', credits: 3, grade: 'A' },
    { name: 'Web Application Development', credits: 3, grade: 'O' },
    { name: 'Artificial Intelligence Lab', credits: 1.5, grade: 'O' },
    { name: 'Design Thinking & Innovation', credits: 2, grade: 'A+' }
  ]);

  private gradeMap: Record<string, number> = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'F': 0
  };

  addSubject(): void {
    this.subjects.update(s => [...s, { name: 'Elective Course', credits: 3, grade: 'A' }]);
  }

  removeSubject(index: number): void {
    this.subjects.update(s => s.filter((_, i) => i !== index));
  }

  totalCredits(): number {
    return this.subjects().reduce((sum, s) => sum + s.credits, 0);
  }

  totalPoints(): number {
    return this.subjects().reduce((sum, s) => sum + (s.credits * (this.gradeMap[s.grade] || 0)), 0);
  }

  calculateSGPA(): number {
    const creds = this.totalCredits();
    if (creds === 0) return 0;
    const gpa = this.totalPoints() / creds;
    return Math.round(gpa * 100) / 100;
  }

  getRequiredAvg(): number {
    const current = Number(this.currentCGPA) || 8.0;
    const target = Number(this.targetCGPA) || 8.5;
    const req = (target * 4 - current * 2) / 2;
    return Math.min(10, Math.max(0, Math.round(req * 100) / 100));
  }
}
