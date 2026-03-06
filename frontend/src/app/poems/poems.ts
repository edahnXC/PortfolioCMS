import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoemService } from '../services/poem';


@Component({
  selector: 'app-poems',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poems.html',
  styleUrls: ['./poems.scss']
})
export class Poems implements OnInit {

  poems: any[] = [];

  currentPage = 1;
  pageSize = 6;

  constructor(private poemService: PoemService) {}

  ngOnInit() {
    this.loadPoems();
  }

  loadPoems() {
    this.poemService.getPoems(this.currentPage, this.pageSize)
      .subscribe((data: any[]) => {

        if(data.length===0){
          this.currentPage--;
          return;
        }
        this.poems = data;
      });
  }

  nextPage() {
    this.currentPage++;
    this.loadPoems();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPoems();
    }
  }

}