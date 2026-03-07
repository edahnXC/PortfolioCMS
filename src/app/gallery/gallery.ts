import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../services/photo';

@Component({
  selector: 'app-gallery',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./gallery.html',
  styleUrls:['./gallery.scss']
})
export class Gallery implements OnInit{

  photos:any[]=[]
  carouselPhotos:any[]=[]

  /* pagination */

  currentPage=1
  pageSize=8
  totalCount=0
  totalPages=1

  pageNumbers:number[]=[]

  /* carousel */

  angle=0
  speed=0.15

  constructor(private photoService:PhotoService){}

  ngOnInit(){
    this.loadPhotos()
    this.startCarousel()
  }

  loadPhotos(){

    this.photoService.getPhotos(this.currentPage,this.pageSize)
    .subscribe((response:any)=>{

      this.photos=response.data
      this.totalCount=response.totalCount

      this.totalPages=Math.ceil(this.totalCount/this.pageSize)

      this.carouselPhotos=this.photos.slice(0,6)

      this.generatePageNumbers()

    })

  }

  /* pagination */

  generatePageNumbers(){

    this.pageNumbers=[]

    for(let i=1;i<=this.totalPages;i++){
      this.pageNumbers.push(i)
    }

  }

  goToPage(page:number){

    if(page<1 || page>this.totalPages) return

    this.currentPage=page
    this.loadPhotos()

  }

  /* carousel */

  startCarousel(){

    setInterval(()=>{

      this.angle+=this.speed

    },16)

  }

  getTrackStyle(){

    return{
      transform:`rotateY(${this.angle}deg)`
    }

  }

  getCardStyle(index:number){

    const count=this.carouselPhotos.length

    const theta=360/count*index
    const radius=320

    return{
      transform:`rotateY(${theta}deg) translateZ(${radius}px)`
    }

  }

}