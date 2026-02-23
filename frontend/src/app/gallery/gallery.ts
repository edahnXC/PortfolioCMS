import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss']
})
export class Gallery implements OnInit, AfterViewInit {

  photos: any[] = [];
  isAdmin = false;

  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAdmin = true;
    }
    this.getPhotos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getPhotos();
    }, 0);
  }

  getPhotos() {
    this.http.get<any[]>('https://localhost:7076/api/Photos')
      .subscribe(data => {
        this.photos = data;
        this.cdr.detectChanges();
      });
  }

  deletePhoto(id: number) {
    this.http.delete(`https://localhost:7076/api/Photos/${id}`)
      .subscribe(() => {
        alert('Photo Deleted');
        this.getPhotos();
      });
  }
}