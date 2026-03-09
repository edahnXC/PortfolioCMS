import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PoemService } from "../services/poem";
import { PhotoService } from '../services/photo';
import { RouterModule } from '@angular/router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit, AfterViewInit {

  poems: any[] = [];
  photos: any[] = [];
  heroImages: string[] = [];

  private poemsLoaded = false;
  private photosLoaded = false;

  constructor(
    private poemService: PoemService,
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.poemService.getPoems(1, 2)
      .subscribe((response: { data: any[]; totalCount: number }) => {
        this.poems = response.data ?? [];
        this.poemsLoaded = true;
        this.cdr.detectChanges();
        this.tryReveal();
      });

    this.photoService.getPhotos(1, 20)
      .subscribe((response: { data: any[]; totalCount: number }) => {
        this.photos = response.data ?? [];
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        this.heroImages = shuffled.slice(0, 3).map(p => p.imagePath);
        this.photosLoaded = true;
        this.cdr.detectChanges();
        this.tryReveal();
      });
  }

  ngAfterViewInit() {}

  // Only run reveal once BOTH APIs have responded and DOM is updated
  private tryReveal() {
    if (!this.poemsLoaded || !this.photosLoaded) return;
    setTimeout(() => {
      ScrollTrigger.refresh();
      // Dispatch a custom event so app.ts re-runs initScrollReveal
      window.dispatchEvent(new CustomEvent('data-loaded'));
    }, 100);
  }
}