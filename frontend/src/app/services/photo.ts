import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private apiUrl='https://localhost:7076/api/Photos';

  constructor(private http: HttpClient){}

  getAllPhotos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
  
}
