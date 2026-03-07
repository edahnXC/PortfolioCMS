import { Component, OnInit, HostListener } from '@angular/core';
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
export class App implements OnInit {

  darkMode = false;
  menuOpen = false;
  isAdminRoute = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Restore saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }

    // Hide navbar and remove body padding on admin routes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
      if (this.isAdminRoute) {
        document.body.classList.add('admin-route');
      } else {
        document.body.classList.remove('admin-route');
      }
    });

    // Also check on first load (in case page refreshed on admin route)
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/admin')) {
      this.isAdminRoute = true;
      document.body.classList.add('admin-route');
    }

    setTimeout(() => this.initScrollReveal(), 100);
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
    gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray<HTMLElement>('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray<HTMLElement>('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray<HTMLElement>('.reveal-scale').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1, scale: 1,
          duration: 0.6,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }
}