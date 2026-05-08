import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class About implements OnInit {

  projects: any[] = [];

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.projectService.getProjects().subscribe((response: any) => {
      this.projects = (response.data ?? []).map((p: any) => ({
        ...p,
        tags: p.techTags ? p.techTags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : []
      }));
      this.cdr.detectChanges();

      // Signal scroll-reveal that DOM is ready
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('data-loaded'));
      }, 80);
    });
  }
}