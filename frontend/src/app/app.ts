import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
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
