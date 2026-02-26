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

  constructor(private poemService: PoemService) {}

  ngOnInit() {
    this.poemService.getAllPoems()
      .subscribe(data => {
        this.poems = data;
      });
  }
}