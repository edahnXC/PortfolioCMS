import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  totalCount = 0;
  totalPages = 1;
  pageNumbers: number[] = [];

  constructor(
    private poemService: PoemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPoems();
  }

  loadPoems() {
    this.poemService.getPoems(this.currentPage, this.pageSize)
      .subscribe((response: any) => {
        this.poems = response.data ?? [];
        this.totalCount = response.totalCount ?? 0;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
        this.buildPageNumbers();
        this.cdr.detectChanges();
      });
  }

  buildPageNumbers() {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadPoems();
  }
}