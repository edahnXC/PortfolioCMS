import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../services/photo';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-gallery-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-public.html',
  styleUrls: ['./gallery-public.scss']
})
export class GalleryPublic implements OnInit {

  photos: any[] = [];

  constructor(
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.photoService.getAllPhotos()
      .subscribe(data => {
        console.log("PHOTOS:", data);
        this.photos = data;
        this.cdr.detectChanges();   // 🔥 FORCE UI UPDATE
      });
  }
}