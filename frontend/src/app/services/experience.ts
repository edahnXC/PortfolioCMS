import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'https://localhost:7076/api/Experiences';

  constructor(private http: HttpClient) {}

  getExperiences() {
    return this.http.get(this.apiUrl);
  }

  createExperience(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateExperience(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteExperience(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
