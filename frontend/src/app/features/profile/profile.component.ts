import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScrollRevealDirective],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      @if (user(); as u) {
        
        <!-- Profile Header Card -->
        <div class="mvgr-card p-8 sm:p-10 relative overflow-hidden appScrollReveal">
          <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div class="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-white/[0.08] border border-blue-200 dark:border-white/10 flex items-center justify-center font-extrabold text-blue-700 dark:text-white text-3xl shadow-sm flex-shrink-0">
              {{ u.name.charAt(0) }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ u.name }}</h1>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ u.registrationNumber }} · MVGRCE</p>
                </div>

                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-white/[0.04] border border-blue-200/60 dark:border-white/10 text-xs font-mono text-blue-700 dark:text-slate-300 mx-auto sm:mx-0 font-bold">
                  ⚡ {{ u.points || 0 }} pts
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 text-xs font-mono">
                <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                  {{ u.branch || 'Engineering' }}
                </span>
                <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                  Year {{ u.year || 1 }}
                </span>
                @if (u.email) {
                  <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                    {{ u.email }}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Settings & Edit Profile Section -->
        <div class="mvgr-card p-6 sm:p-8 space-y-6 appScrollReveal">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white tracking-tight">Profile Details & Directory Settings</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your public campus directory visibility and academic details</p>
            </div>
            <button 
              type="button" 
              [disabled]="isSaving()"
              (click)="saveProfile()"
              class="mvgr-btn-primary disabled:opacity-50 text-xs">
              {{ isSaving() ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            <!-- Full Name -->
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">Full Name</label>
              <input 
                type="text" 
                [(ngModel)]="editName"
                class="mvgr-input"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">Email Address</label>
              <input 
                type="email" 
                [(ngModel)]="editEmail"
                placeholder="student@college.edu"
                class="mvgr-input"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">Phone Number</label>
              <input 
                type="text" 
                [(ngModel)]="editPhone"
                placeholder="+91 9876543210"
                class="mvgr-input"
              />
            </div>

            <!-- Branch & Year -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">Branch</label>
                <select 
                  [(ngModel)]="editBranch"
                  class="mvgr-input">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">Year</label>
                <select 
                  [(ngModel)]="editYear"
                  class="mvgr-input">
                  <option [ngValue]="1">Year 1</option>
                  <option [ngValue]="2">Year 2</option>
                  <option [ngValue]="3">Year 3</option>
                  <option [ngValue]="4">Year 4</option>
                </select>
              </div>
            </div>

            <!-- Bio -->
            <div class="md:col-span-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">Bio & Technical Interests</label>
              <textarea 
                [(ngModel)]="editBio"
                rows="3"
                placeholder="Share your interests, projects, or hackathon aspirations..."
                class="mvgr-input"></textarea>
            </div>

            <!-- Skills Tag Input -->
            <div class="md:col-span-2 space-y-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] font-mono">
                Skills & Technologies
              </label>
              
              <div class="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                @for (skill of skillsList(); track skill) {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-mono shadow-sm">
                    {{ skill }}
                    <button type="button" (click)="removeSkill(skill)" class="hover:text-rose-500 font-bold ml-0.5">×</button>
                  </span>
                }
                
                <div class="flex items-center gap-2">
                  <input 
                    type="text" 
                    [(ngModel)]="newSkillInput"
                    (keydown.enter)="$event.preventDefault(); addSkill()"
                    placeholder="Add skill..."
                    class="bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none px-2 py-1 font-mono"
                  />
                  <button 
                    type="button" 
                    (click)="addSkill()"
                    class="mvgr-btn-secondary text-[11px] py-1 px-2.5">
                    + Add
                  </button>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">GitHub Profile</label>
              <input 
                type="text" 
                [(ngModel)]="editGithub"
                placeholder="https://github.com/username"
                class="mvgr-input"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-mono">LinkedIn Profile</label>
              <input 
                type="text" 
                [(ngModel)]="editLinkedin"
                placeholder="https://linkedin.com/in/username"
                class="mvgr-input"
              />
            </div>

            <!-- Privacy Toggles -->
            <div class="md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/[0.06] space-y-3">
              <h3 class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs font-mono">Directory Privacy</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] cursor-pointer hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                  <input type="checkbox" [(ngModel)]="showEmail" class="rounded border-slate-300 text-blue-600 focus:ring-0">
                  <span class="text-slate-700 dark:text-slate-300 text-xs">Show email</span>
                </label>

                <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] cursor-pointer hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                  <input type="checkbox" [(ngModel)]="showPhone" class="rounded border-slate-300 text-blue-600 focus:ring-0">
                  <span class="text-slate-700 dark:text-slate-300 text-xs">Show phone</span>
                </label>

                <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] cursor-pointer hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                  <input type="checkbox" [(ngModel)]="showLinks" class="rounded border-slate-300 text-blue-600 focus:ring-0">
                  <span class="text-slate-700 dark:text-slate-300 text-xs">Show social links</span>
                </label>
              </div>
            </div>

          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-end gap-3">
            <button 
              type="button" 
              [disabled]="isSaving()"
              (click)="saveProfile()"
              class="mvgr-btn-primary disabled:opacity-50 text-xs">
              {{ isSaving() ? 'Saving Changes...' : 'Save Profile Changes' }}
            </button>
          </div>
        </div>

      } @else {
        <div class="p-16 text-center text-slate-400 font-mono text-xs">
          Loading student profile...
        </div>
      }

    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  toastService = inject(ToastService);

  user = signal<User | null>(null);
  isSaving = signal(false);

  editName = '';
  editEmail = '';
  editPhone = '';
  editBranch = 'Computer Science';
  editYear = 1;
  editBio = '';
  editGithub = '';
  editLinkedin = '';
  showEmail = true;
  showPhone = false;
  showLinks = true;

  skillsList = signal<string[]>([]);
  newSkillInput = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (u) => {
        this.user.set(u);
        this.editName = u.name || '';
        this.editEmail = u.email || '';
        this.editPhone = u.phone || '';
        this.editBranch = u.branch || 'Computer Science';
        this.editYear = u.year || 1;
        this.editBio = u.bio || '';
        this.editGithub = u.links?.github || '';
        this.editLinkedin = u.links?.linkedin || '';
        this.showEmail = u.privacy?.showEmail ?? true;
        this.showPhone = u.privacy?.showPhone ?? false;
        this.showLinks = u.privacy?.showLinks ?? true;
        this.skillsList.set(u.skills || []);
      },
      error: () => this.toastService.error('Could not load profile')
    });
  }

  addSkill(): void {
    const s = this.newSkillInput.trim();
    if (s && !this.skillsList().includes(s)) {
      this.skillsList.update(list => [...list, s]);
      this.newSkillInput = '';
    }
  }

  removeSkill(skill: string): void {
    this.skillsList.update(list => list.filter(item => item !== skill));
  }

  saveProfile(): void {
    this.isSaving.set(true);

    const payload: Partial<User> = {
      name: this.editName,
      email: this.editEmail,
      phone: this.editPhone,
      branch: this.editBranch,
      year: this.editYear,
      bio: this.editBio,
      skills: this.skillsList(),
      links: {
        github: this.editGithub,
        linkedin: this.editLinkedin
      },
      privacy: {
        showEmail: this.showEmail,
        showPhone: this.showPhone,
        showLinks: this.showLinks
      }
    };

    this.profileService.updateMyProfile(payload).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.user.set(updated);
        this.authService.refreshUser().subscribe();
        this.toastService.success('Your profile has been updated!');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.toastService.error(err.error?.message || 'Could not update profile');
      }
    });
  }
}
