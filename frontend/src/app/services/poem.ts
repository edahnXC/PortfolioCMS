import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  private apiUrl = 'https://localhost:7076/api/Poems';

  constructor(private http: HttpClient) {}

  // 🔵 Paginated poems (used in Poems page)
  getPoems(page: number, pageSize: number): Observable<{data:any[], totalCount: number}> {
    return this.http.get<{data:any[], totalCount: number}>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
    );
  }

  // 🔵 Latest poems (used in Home page)
  getLatestPoems(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?page=1&pageSize=2`
    );
  }

  // 🔴 Admin - create poem
  createPoem(poem: any): Observable<any> {
    return this.http.post(this.apiUrl, poem);
  }

  // 🔴 Admin - delete poem
  deletePoem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}