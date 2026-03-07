import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PoemService } from "../services/poem";
import { PhotoService } from '../services/photo';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {

  poems:any[]=[]
  photos:any[]=[]
  heroImages:string[]=[]

  constructor(
    private poemService:PoemService,
    private photoService:PhotoService
  ){}

  ngOnInit(){

    // Latest poems
    this.poemService.getPoems(1,2)
    .subscribe((response: { data: any[]; totalCount: number })=>{
      this.poems=response.data
    })

    // Fetch photos
    this.photoService.getPhotos(1,20)
    .subscribe((response: { data: any[]; totalCount: number })=>{

      this.photos=response.data

      const shuffled = response.data.sort(() => 0.5 - Math.random())

      this.heroImages = shuffled
      .slice(0,3)
      .map(p => 'https://localhost:7076/' + p.imagePath)

    })

  }

}