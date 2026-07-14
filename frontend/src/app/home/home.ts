import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PoemService } from "../services/poem";
import { PhotoService } from '../services/photo';
import { ProjectService } from '../services/project';
import { ExperienceService } from '../services/experience';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {

  poems: any[] = [];
  photos: any[] = [];
  projects: any[] = [];
  experiences: any[] = [];

  private poemsLoaded = false;
  private photosLoaded = false;
  private projectsLoaded = false;
  private experiencesLoaded = false;

  constructor(
    private poemService: PoemService,
    private photoService: PhotoService,
    private projectService: ProjectService,
    private experienceService: ExperienceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.poemService.getPoems(1, 2).subscribe((res: any) => {
      this.poems = res.data ?? [];
      this.poemsLoaded = true;
      this.tryReveal();
    });

    this.photoService.getPhotos(1, 6).subscribe((res: any) => {
      this.photos = res.data ?? [];
      this.photosLoaded = true;
      this.tryReveal();
    });

    this.projectService.getProjects().subscribe((res: any) => {
      this.projects = res.data ?? [];
      this.projectsLoaded = true;
      this.tryReveal();
    });

    this.experienceService.getExperiences().subscribe((res: any) => {
      this.experiences = res.data ?? [];
      this.experiencesLoaded = true;
      this.tryReveal();
    });
  }

  private tryReveal() {
    if (!this.poemsLoaded || !this.photosLoaded || !this.projectsLoaded || !this.experiencesLoaded) return;
    this.cdr.detectChanges();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('data-loaded'));
    }, 80);
  }
}