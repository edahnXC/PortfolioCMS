import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  // Replace this with your actual Formspree endpoint URL
  private formspreeUrl = 'https://formspree.io/f/YOUR_FORM_ID';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Dispatch data-loaded so the App component knows to trigger GSAP animations
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('data-loaded'));
    }, 100);
  }

  ngOnDestroy() {
    // Cleanup if necessary
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    this.http.post(this.formspreeUrl, this.contactForm.value, { headers }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => this.submitSuccess = false, 5000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = true;
        console.error('Form submission error:', error);
      }
    });
  }
}
