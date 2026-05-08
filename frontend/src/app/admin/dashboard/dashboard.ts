import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoemService } from '../../services/poem';
import { PhotoService } from '../../services/photo';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  activeTab = 'overview';
  sidebarOpen = false;
  adminDark = false;

  /* ── Stats ── */
  totalPoems = 0;
  totalPhotos = 0;
  totalProjects = 0;

  /* ── Poems ── */
  poems: any[] = [];
  poemPage = 1;
  poemPageSize = 10;
  poemTotalPages = 1;
  editingPoemId: number | null = null;
  editPoem: any = {};

  /* ── New poem ── */
  newPoem = { title: '', content: '', category: '', createdDate: new Date() };
  addingPoem = false;
  poemSuccess = false;

  /* ── Photos ── */
  photos: any[] = [];
  photoPage = 1;
  photoPageSize = 12;
  photoTotalPages = 1;
  editingPhotoId: number | null = null;
  editPhotoTitle = '';

  /* ── New photo ── */
  newPhotoTitle = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadingPhoto = false;
  photoSuccess = false;

  /* ── Projects ── */
  projects: any[] = [];
  editingProjectId: number | null = null;
  editProject: any = {};

  /* ── New project ── */
  newProject = { name: '', description: '', link: '', icon: '🗂️', techTags: '', displayOrder: 0, createdDate: new Date() };
  addingProject = false;
  projectSuccess = false;

  constructor(
    private router: Router,
    private poemService: PoemService,
    private photoService: PhotoService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Restore admin theme preference
    const savedAdminTheme = localStorage.getItem('adminTheme');
    if (savedAdminTheme === 'dark') {
      this.adminDark = true;
    }
    this.loadStats();
  }

  get tabTitle(): string {
    const titles: Record<string, string> = {
      'overview':    'Dashboard',
      'poems':       'Manage Poems',
      'photos':      'Manage Photos',
      'projects':    'Manage Projects',
      'add-poem':    'Add Poem',
      'add-photo':   'Upload Photo',
      'add-project': 'Add Project'
    };
    return titles[this.activeTab] ?? 'Dashboard';
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.sidebarOpen = false;
    if (tab === 'poems')    this.loadPoems(1);
    if (tab === 'photos')   this.loadPhotos(1);
    if (tab === 'projects') this.loadProjects();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }

  toggleAdminTheme() {
    this.adminDark = !this.adminDark;
    localStorage.setItem('adminTheme', this.adminDark ? 'dark' : 'light');
  }

  /* ── Stats ── */

  loadStats() {
    this.poemService.getPoems(1, 1).subscribe((r: any) => {
      this.totalPoems = r.totalCount;
      this.cdr.detectChanges();
    });
    this.photoService.getPhotos(1, 1).subscribe((r: any) => {
      this.totalPhotos = r.totalCount;
      this.cdr.detectChanges();
    });
    this.projectService.getProjects().subscribe((r: any) => {
      this.totalProjects = r.totalCount;
      this.cdr.detectChanges();
    });
  }

  /* ── Poems ── */

  loadPoems(page: number) {
    this.poemPage = page;
    this.poemService.getPoems(page, this.poemPageSize).subscribe((r: any) => {
      this.poems = r.data;
      this.poemTotalPages = Math.ceil(r.totalCount / this.poemPageSize);
      this.cdr.detectChanges();
    });
  }

  startEditPoem(poem: any) {
    this.editingPoemId = poem.id;
    this.editPoem = { ...poem };
  }

  cancelEdit() {
    this.editingPoemId = null;
    this.editPoem = {};
  }

  savePoem(id: number) {
    this.poemService.updatePoem(id, this.editPoem).subscribe(() => {
      this.editingPoemId = null;
      this.loadPoems(this.poemPage);
    });
  }

  deletePoem(id: number) {
    if (!confirm('Delete this poem?')) return;
    this.poemService.deletePoem(id).subscribe(() => {
      this.loadPoems(this.poemPage);
      this.totalPoems--;
      this.cdr.detectChanges();
    });
  }

  addPoem() {
    if (!this.newPoem.title || !this.newPoem.content) return;
    this.addingPoem = true;
    this.poemSuccess = false;
    this.newPoem.createdDate = new Date();

    this.poemService.createPoem(this.newPoem).subscribe(() => {
      this.addingPoem = false;
      this.poemSuccess = true;
      this.newPoem = { title: '', content: '', category: '', createdDate: new Date() };
      this.totalPoems++;
      this.cdr.detectChanges();
      setTimeout(() => { this.poemSuccess = false; this.cdr.detectChanges(); }, 3000);
    });
  }

  /* ── Photos ── */

  loadPhotos(page: number) {
    this.photoPage = page;
    this.photoService.getPhotos(page, this.photoPageSize).subscribe((r: any) => {
      this.photos = r.data;
      this.photoTotalPages = Math.ceil(r.totalCount / this.photoPageSize);
      this.cdr.detectChanges();
    });
  }

  startEditPhoto(photo: any) {
    this.editingPhotoId = photo.id;
    this.editPhotoTitle = photo.title;
  }

  savePhoto(id: number) {
    this.photoService.updatePhoto(id, this.editPhotoTitle).subscribe(() => {
      this.editingPhotoId = null;
      this.loadPhotos(this.photoPage);
    });
  }

  deletePhoto(id: number) {
    if (!confirm('Delete this photo?')) return;
    this.photoService.deletePhoto(id).subscribe(() => {
      this.loadPhotos(this.photoPage);
      this.totalPhotos--;
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      this.previewUrl = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      this.previewUrl = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  uploadPhoto() {
    if (!this.selectedFile || !this.newPhotoTitle) return;
    this.uploadingPhoto = true;
    this.photoSuccess = false;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.newPhotoTitle);

    this.photoService.uploadPhoto(formData).subscribe(() => {
      this.uploadingPhoto = false;
      this.photoSuccess = true;
      this.newPhotoTitle = '';
      this.selectedFile = null;
      this.previewUrl = null;
      this.totalPhotos++;
      this.cdr.detectChanges();
      setTimeout(() => { this.photoSuccess = false; this.cdr.detectChanges(); }, 3000);
    });
  }

  /* ── Projects ── */

  loadProjects() {
    this.projectService.getProjects().subscribe((r: any) => {
      this.projects = r.data ?? [];
      this.totalProjects = r.totalCount;
      this.cdr.detectChanges();
    });
  }

  startEditProject(project: any) {
    this.editingProjectId = project.id;
    this.editProject = { ...project };
  }

  cancelEditProject() {
    this.editingProjectId = null;
    this.editProject = {};
  }

  saveProject(id: number) {
    this.projectService.updateProject(id, this.editProject).subscribe(() => {
      this.editingProjectId = null;
      this.loadProjects();
    });
  }

  deleteProject(id: number) {
    if (!confirm('Delete this project?')) return;
    this.projectService.deleteProject(id).subscribe(() => {
      this.loadProjects();
      this.totalProjects--;
      this.cdr.detectChanges();
    });
  }

  addProject() {
    if (!this.newProject.name || !this.newProject.description) return;
    this.addingProject = true;
    this.projectSuccess = false;
    this.newProject.createdDate = new Date();

    this.projectService.createProject(this.newProject).subscribe(() => {
      this.addingProject = false;
      this.projectSuccess = true;
      this.newProject = { name: '', description: '', link: '', icon: '🗂️', techTags: '', displayOrder: 0, createdDate: new Date() };
      this.totalProjects++;
      this.cdr.detectChanges();
      setTimeout(() => { this.projectSuccess = false; this.cdr.detectChanges(); }, 3000);
    });
  }
}