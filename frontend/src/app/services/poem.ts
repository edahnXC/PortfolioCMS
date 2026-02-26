import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  private apiUrl = 'https://localhost:7076/api/Poems';

  constructor(private http: HttpClient) {}

  getAllPoems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPoem(poem: any): Observable<any> {
    return this.http.post(this.apiUrl, poem);
  }

  deletePoem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}