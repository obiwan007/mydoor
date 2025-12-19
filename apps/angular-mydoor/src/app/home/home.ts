import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CodeService } from '../services/code.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected code = signal('');
  protected digits: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  private readonly snack = inject(MatSnackBar);
  private readonly codeService = inject(CodeService);
  protected loading = signal(false);

  protected appendDigit(d: string) {
    this.code.update((c) => c + d);
  }

  protected open() {
    const current = this.code();
    if (!current || this.loading()) return;
    this.loading.set(true);
    this.codeService
      .submitCode(current)
      .pipe(
        finalize(() => {
          this.code.set('');
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.snack.open('Access granted', 'OK', { duration: 2000 });
          } else {
            this.snack.open('Access denied', 'Dismiss', { duration: 2500 });
          }
        },
        error: () => this.snack.open('Network error', 'Dismiss', { duration: 2500 }),
      });
  }

  protected back() {
    const current = this.code();
    if (current.length > 0) this.code.set(current.slice(0, -1));
  }
}
