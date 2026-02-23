import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-photo.html',
  styleUrls: ['./upload-photo.scss']
})
export class UploadPhoto {

  selectedFile!: File;
  title = '';

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.title);

    this.http.post('https://localhost:7076/api/Photos/upload', formData)
      .subscribe(res => {
        alert('Photo Uploaded Successfully');
      });
  }
}