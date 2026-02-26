import { Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PoemService} from "../services/poem";
import { PhotoService } from '../services/photo';
@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
poems:any[]=[];
photos:any[]=[];

constructor(private poemService:PoemService,
  private photoService:PhotoService
){}

ngOnInit() {
  this.poemService.getAllPoems().subscribe(
    (data) => {
      this.poems = data.slice(0,2);// show only latest 2 poems
    });

  this.photoService.getAllPhotos()
      .subscribe(data => {
        this.photos = data.slice(0,3);
      });
}
}
