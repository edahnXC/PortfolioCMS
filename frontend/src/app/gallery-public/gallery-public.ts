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

  currentPage = 1;
  pageSize = 6;

  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.photoService.getPhotos(this.currentPage, this.pageSize)
      .subscribe((data:any[]) => {

        if(data.length===0){
          this.currentPage--;
          return;
        }
        this.photos = data;
      });
  }

  nextPage() {
    this.currentPage++;
    this.loadPhotos();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPhotos();
    }
  }

}