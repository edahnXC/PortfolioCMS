import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../services/photo';

@Component({
  selector: 'app-gallery-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-public.html',
  styleUrls: ['./gallery-public.scss']
})
export class GalleryPublic implements OnInit {

  photos: any[] = [];

  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.getAllPhotos()
      .subscribe(data => {
        this.photos = data;
      });
  }
}