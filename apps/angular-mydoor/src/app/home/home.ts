import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected code = '';
  protected digits: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  protected appendDigit(d: string) {
    this.code += d;
  }

  protected open() {
    // Placeholder for open action; integrate with backend or routing as needed.
    console.log('Open with code:', this.code);
  }
}
