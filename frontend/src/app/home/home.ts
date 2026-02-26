import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PoemService } from "../services/poem";
import { PhotoService } from '../services/photo';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {

  poems: any[] = [];
  photos: any[] = [];

  constructor(
    private poemService: PoemService,
    private photoService: PhotoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.poemService.getAllPoems()
      .subscribe(data => {
        this.poems = data.slice(0,2);
        this.cdr.detectChanges();
      });

    this.photoService.getAllPhotos()
      .subscribe(data => {
        this.photos = data.slice(0,3);
        this.cdr.detectChanges();
      });

  }
}