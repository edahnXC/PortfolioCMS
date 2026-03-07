import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../services/photo';

@Component({
  selector: 'app-gallery-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-public.html',
  styleUrls: ['./gallery-public.scss']
})
export class GalleryPublic implements OnInit, OnDestroy {

  /* ── Data ── */
  photos: any[] = [];

  /* ── Carousel ── */
  readonly PAGE_SIZE = 6;
  readonly CARD_WIDTH = 280;
  readonly CARD_GAP = 24;
  readonly SPEED_PX_PER_SEC = 70;

  carouselPhotos: any[] = [];
  translateX = 0;
  private animFrame: number | null = null;
  private lastTimestamp: number | null = null;
  private loopWidth = 0;

  /* ── Pagination ── */
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  pageNumbers: number[] = [];

  /* ── Lightbox ── */
  lightboxOpen = false;
  activePhoto: any = null;
  private activeLightboxIndex = 0;

  constructor(
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadPhotos();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  /* ── Data ── */

  loadPhotos() {
    this.photoService.getPhotos(this.currentPage, this.PAGE_SIZE)
      .subscribe((response: { data: any[]; totalCount: number }) => {
        this.photos = response.data ?? [];
        this.totalCount = response.totalCount ?? 0;
        this.totalPages = Math.ceil(this.totalCount / this.PAGE_SIZE) || 1;
        this.buildPageNumbers();
        this.buildCarousel();
        this.cdr.detectChanges();
      });
  }

  /* ── Pagination ── */

  buildPageNumbers() {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadPhotos();
  }

  /* ── Build carousel strip ── */

  buildCarousel() {
    // Always fully stop and reset before rebuilding
    this.stopCarousel();
    this.translateX = 0;
    this.lastTimestamp = null;

    if (this.photos.length === 0) {
      this.carouselPhotos = [];
      this.loopWidth = 0;
      return;
    }

    // Width of one full set of real photos
    const singleSetWidth = this.photos.length * (this.CARD_WIDTH + this.CARD_GAP);

    // Always duplicate so there is always something coming from the right
    // We repeat enough times to guarantee the strip is wider than the screen
    const screenWidth = window.innerWidth || 1200;
    const repeatsNeeded = Math.ceil((screenWidth * 2) / singleSetWidth) + 1;
    const repeated = Array.from(
      { length: repeatsNeeded },
      () => [...this.photos]
    ).flat();

    this.carouselPhotos = repeated;
    this.loopWidth = singleSetWidth;

    // Apply initial position immediately so no jump on first frame
    this.applyTrackTransform();

    // Start fresh animation loop
    this.startCarousel();
  }

  /* ── Carousel animation ── */

  private applyTrackTransform() {
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (track) {
      track.style.transform = `translateX(${this.translateX}px)`;
    }
  }

  private startCarousel() {
    this.ngZone.runOutsideAngular(() => {
      const animate = (timestamp: number) => {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const delta = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        if (!this.lightboxOpen && this.loopWidth > 0) {
          this.translateX -= this.SPEED_PX_PER_SEC * delta;

          // When one full set has scrolled off, snap back — seamless loop
          if (Math.abs(this.translateX) >= this.loopWidth) {
            this.translateX = this.translateX + this.loopWidth;
          }
        }

        const track = document.querySelector('.carousel-track') as HTMLElement;
        if (track) {
          track.style.transform = `translateX(${this.translateX}px)`;
        }

        this.animFrame = requestAnimationFrame(animate);
      };

      this.animFrame = requestAnimationFrame(animate);
    });
  }

  private stopCarousel() {
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  /* ── Lightbox ── */

  openLightbox(photo: any, index: number) {
    this.activePhoto = photo;
    this.activeLightboxIndex = index % this.photos.length;
    this.lightboxOpen = true;
    this.cdr.detectChanges();
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.activePhoto = null;
    this.cdr.detectChanges();
  }

  lightboxPrev() {
    if (this.photos.length === 0) return;
    this.activeLightboxIndex =
      (this.activeLightboxIndex - 1 + this.photos.length) % this.photos.length;
    this.activePhoto = this.photos[this.activeLightboxIndex];
    this.cdr.detectChanges();
  }

  lightboxNext() {
    if (this.photos.length === 0) return;
    this.activeLightboxIndex =
      (this.activeLightboxIndex + 1) % this.photos.length;
    this.activePhoto = this.photos[this.activeLightboxIndex];
    this.cdr.detectChanges();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      this.closeLightbox();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (event.key === 'ArrowLeft')  this.lightboxPrev();
    if (event.key === 'ArrowRight') this.lightboxNext();
    if (event.key === 'Escape')     this.closeLightbox();
  }
}