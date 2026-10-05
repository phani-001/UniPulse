import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-object',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full flex items-center justify-center pointer-events-none select-none overflow-visible">
      
      <!-- Ambient Backlight Drift -->
      <div class="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-[80px] animate-orb-drift"></div>
      <div class="absolute w-56 h-56 rounded-full bg-violet-600/10 blur-[60px] animate-orb-drift" style="animation-delay: -5s;"></div>

      <!-- Core Geometric Floating Rings & Glass Polyhedron -->
      <div class="relative w-64 h-64 flex items-center justify-center animate-float-slow">
        
        <!-- Outer Gyroscope Ring -->
        <div class="absolute inset-0 rounded-full border border-indigo-400/20 [transform:rotateX(65deg)_rotateY(25deg)] animate-spin" style="animation-duration: 28s;"></div>
        
        <!-- Middle Counter-Rotating Glass Ring -->
        <div class="absolute w-48 h-48 rounded-full border border-violet-400/25 [transform:rotateX(-45deg)_rotateY(-35deg)] animate-spin" style="animation-duration: 20s; animation-direction: reverse;"></div>

        <!-- Center Prismatic Frosted Core -->
        <div class="relative w-28 h-28 rounded-2xl bg-gradient-to-tr from-white/[0.08] via-white/[0.03] to-transparent border border-white/20 backdrop-blur-xl shadow-2xl shadow-indigo-950/60 [transform:rotate(12deg)] flex items-center justify-center">
          <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center backdrop-blur-md">
            <svg class="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <!-- Floating Satellite Capsule 1: Top Right -->
        <div class="absolute -top-4 -right-2 px-3 py-1.5 rounded-full bg-[#11131a]/90 border border-white/10 shadow-xl backdrop-blur-md animate-float-reverse flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[11px] font-mono font-medium text-slate-200 tracking-tight">12 Campus Clubs</span>
        </div>

        <!-- Floating Satellite Capsule 2: Bottom Left -->
        <div class="absolute -bottom-6 -left-4 px-3 py-1.5 rounded-full bg-[#11131a]/90 border border-white/10 shadow-xl backdrop-blur-md animate-float-slow flex items-center gap-2" style="animation-delay: -2s;">
          <span class="text-[11px] text-amber-400 font-mono">⚡ 450 pts</span>
          <span class="text-[10px] text-slate-400">Arjun Sharma</span>
        </div>

        <!-- Floating Satellite Capsule 3: Right Mid -->
        <div class="absolute -right-10 bottom-12 px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-[10px] font-mono text-indigo-300 backdrop-blur-md animate-float-reverse" style="animation-delay: -4s;">
          HackNITR · Active
        </div>

      </div>

    </div>
  `
})
export class FloatingObjectComponent {
  @Input() variant: 'hero' | 'compact' = 'hero';
}
