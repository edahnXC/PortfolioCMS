import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Added RouterLink
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule], // Added RouterLink here too
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  darkMode = false;

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}