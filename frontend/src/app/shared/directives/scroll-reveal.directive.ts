import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay: string = '';
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;
    el.classList.add('reveal-item');
    if (this.revealDelay) {
      el.classList.add(this.revealDelay);
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('revealed');
              this.observer?.unobserve(el);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      this.observer.observe(el);
    } else {
      // Fallback
      el.classList.add('revealed');
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
