import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/Projects`;

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` })
    };
  }

  // 🔵 PUBLIC — all projects (ordered by DisplayOrder on backend)
  getProjects(): Observable<{ data: any[]; totalCount: number }> {
    return this.http.get<{ data: any[]; totalCount: number }>(this.apiUrl);
  }

  // 🔴 ADMIN — create project
  createProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project, this.authHeaders());
  }

  // 🔴 ADMIN — update project
  updateProject(id: number, project: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        name:         project.name,
        description:  project.description,
        link:         project.link,
        icon:         project.icon,
        techTags:     project.techTags,
        displayOrder: project.displayOrder
      },
      this.authHeaders()
    );
  }

  // 🔴 ADMIN — delete project
  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders());
  }
}
