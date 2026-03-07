import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl = `${environment.apiUrl}/api/Photos`;

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` })
    };
  }

  getPhotos(page: number, pageSize: number): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
    );
  }

  getLatestPhotos(): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(
      `${this.apiUrl}?page=1&pageSize=3`
    );
  }

  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData, this.authHeaders());
  }

  updatePhoto(id: number, title: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { title },
      this.authHeaders()
    );
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders());
  }
}