import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoemService } from '../../services/poem';

@Component({
  selector: 'app-add-poem',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-poem.html',
  styleUrls: ['./add-poem.scss']
})
export class AddPoem {

  poem = {
    title: '',
    content: '',
    createdDate: new Date(),
    category: ''
  };

  constructor(private poemService: PoemService) {}

  addPoem() {
    this.poemService.createPoem(this.poem)
      .subscribe(res => {
        alert('Poem Added Successfully');
      });
  }
}