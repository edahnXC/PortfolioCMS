import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../../services/photo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-photo.html',
  styleUrls: ['./upload-photo.scss']
})
export class UploadPhoto {

  selectedFile!: File;
  title: string = '';

  constructor(private photoService: PhotoService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {

    const formData = new FormData();

    formData.append('file', this.selectedFile);
    formData.append('title', this.title);

    this.photoService.uploadPhoto(formData)
      .subscribe(() => {
        alert("Photo Uploaded Successfully");
      });
  }

}