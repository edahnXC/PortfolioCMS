import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  private apiUrl = 'https://localhost:7076/api/Poems';

  constructor(private http: HttpClient) {}

  createPoem(poem: any) {
    return this.http.post(this.apiUrl, poem);
  }

  getPoems() {
    return this.http.get(this.apiUrl);
  }

  deletePoem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}