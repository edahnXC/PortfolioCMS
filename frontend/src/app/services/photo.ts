import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl = 'https://localhost:7076/api/Photos';

  constructor(private http: HttpClient) {}

  // 🔵 Paginated photos
  getPhotos(page: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
    );
  }

  // 🔵 Latest photos for homepage
  getLatestPhotos(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?page=1&pageSize=3`
    );
  }

  // 🔴 Upload photo
  uploadPhoto(formData: FormData) {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // 🔴 Delete photo
  deletePhoto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}