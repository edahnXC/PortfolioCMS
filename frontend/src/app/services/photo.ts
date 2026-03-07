import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl = 'https://localhost:7076/api/Photos';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` })
    };
  }

  // 🔵 PUBLIC — paginated photos
  getPhotos(page: number, pageSize: number): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
    );
  }

  // 🔵 PUBLIC — latest photos for homepage
  getLatestPhotos(): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(
      `${this.apiUrl}?page=1&pageSize=3`
    );
  }

  // 🔴 ADMIN — upload photo
  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData, this.authHeaders());
  }

  // 🔴 ADMIN — update photo title only (matches UpdatePhotoRequest DTO)
  updatePhoto(id: number, title: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { title },
      this.authHeaders()
    );
  }

  // 🔴 ADMIN — delete photo
  deletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders());
  }
}