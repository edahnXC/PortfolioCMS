import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  darkMode = false;
  menuOpen = false;
  isAdminRoute = false;
  isScrolled = false;
  currentYear = new Date().getFullYear();

  private revealDone = false;
  private dataLoadedHandler = () => this.onDataLoaded();

  constructor(private router: Router) {}

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
      this.revealDone = false;

      window.scrollTo({ top: 0, behavior: 'instant' });

      if (this.isAdminRoute) {
        document.body.classList.add('admin-route');
      } else {
        document.body.classList.remove('admin-route');
        ScrollTrigger.getAll().forEach(t => t.kill());
      }
    });

    if (this.router.url.startsWith('/admin')) {
      this.isAdminRoute = true;
      document.body.classList.add('admin-route');
    }

    // Pages with API data fire this after DOM is ready
    window.addEventListener('data-loaded', this.dataLoadedHandler);

    // Static pages like About fire this immediately
    setTimeout(() => {
      if (!this.revealDone) {
        this.revealDone = true;
        this.initScrollReveal();
      }
    }, 300);

    // Set initial scroll state
    this.checkScroll();
  }

  ngOnDestroy() {
    window.removeEventListener('data-loaded', this.dataLoadedHandler);
  }

  private onDataLoaded() {
    if (this.revealDone) return;
    this.revealDone = true;
    setTimeout(() => this.initScrollReveal(), 50);
  }

  @HostListener('window:scroll')
  checkScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('mobile-menu')) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

  initScrollReveal() {
    const animateEl = (el: HTMLElement, fromVars: any, toVars: any, delay = 0) => {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight;

      if (inViewport) {
        gsap.fromTo(el, fromVars, {
          ...toVars,
          delay,
          duration: toVars.duration ?? 0.8,
          ease: toVars.ease ?? 'power3.out'
        });
      } else {
        gsap.fromTo(el, fromVars, {
          ...toVars,
          delay,
          duration: toVars.duration ?? 0.8,
          ease: toVars.ease ?? 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });
      }
    };

    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el, i) => {
      animateEl(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, i * 0.06);
    });

    gsap.utils.toArray<HTMLElement>('.reveal-left').forEach(el => {
      animateEl(el, { opacity: 0, x: -40 }, { opacity: 1, x: 0 });
    });

    gsap.utils.toArray<HTMLElement>('.reveal-right').forEach(el => {
      animateEl(el, { opacity: 0, x: 40 }, { opacity: 1, x: 0 });
    });

    // reveal-scale — stagger for cards, smooth duration for gallery images
    gsap.utils.toArray<HTMLElement>('.reveal-scale').forEach((el, i) => {
      const isGallery = el.closest('.masonry') !== null;
      animateEl(
        el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: isGallery ? 1 : 0.6,
          ease: isGallery ? 'power3.out' : 'back.out(1.2)'
        },
        isGallery ? i * 0.12 : i * 0.07
      );
    });
  }
}