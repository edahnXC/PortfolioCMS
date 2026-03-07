import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  private apiUrl = 'https://localhost:7076/api/Poems';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` })
    };
  }

  // 🔵 PUBLIC — paginated poems
  getPoems(page: number, pageSize: number): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`
    );
  }

  // 🔵 PUBLIC — latest 2 poems for homepage
  getLatestPoems(): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(
      `${this.apiUrl}?page=1&pageSize=2`
    );
  }

  // 🔵 PUBLIC — single poem by id
  getPoem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 🔴 ADMIN — create poem
  createPoem(poem: any): Observable<any> {
    return this.http.post(this.apiUrl, poem, this.authHeaders());
  }

  // 🔴 ADMIN — update poem (matches UpdatePoemRequest DTO — only title/content/category)
  updatePoem(id: number, poem: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        title:    poem.title,
        content:  poem.content,
        category: poem.category
      },
      this.authHeaders()
    );
  }

  // 🔴 ADMIN — delete poem
  deletePoem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders());
  }
}