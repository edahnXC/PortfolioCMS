import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss']
})
export class Gallery implements OnInit {

  isAdmin = false; // This should be set based on actual authentication logic 

  photos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPhotos();

    const token=localStorage.getItem('token');
    if(token){
      this.isAdmin=true;
    }
  }

  getPhotos() {
    this.http.get<any[]>('https://localhost:7076/api/Photos')
      .subscribe(data => {
        this.photos = data;
      });
  }

  deletePhoto(id: number) {
    this.http.delete(`https://localhost:7076/api/Photos/${id}`)
      .subscribe(() => {
        alert('Photo Deleted');
        this.getPhotos(); // refresh gallery
      });
  }
}