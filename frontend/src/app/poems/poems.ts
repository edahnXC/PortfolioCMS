import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoemService } from '../services/poem';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-poems',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poems.html',
  styleUrls: ['./poems.scss']
})
export class Poems implements OnInit {

  poems: any[] = [];

  constructor(
    private poemService: PoemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.poemService.getAllPoems()
      .subscribe(data => {
        console.log("POEMS:", data);
        this.poems = data;
        this.cdr.detectChanges();   // FORCE UI UPDATE
      });
  }
}