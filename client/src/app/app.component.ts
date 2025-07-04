import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerWheelComponent } from './spinner-wheel/spinner-wheel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, FormsModule, SpinnerWheelComponent],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  options: string[] = [];
  newOption: string = '';
  result: string | null = null;
  isSpinning = false;
  rotation = 0; 

  constructor(private spinnerService: SpinnerService) {}

  addOption(): void {
    const trimmed = this.newOption.trim();
    if (trimmed) {
      this.options.push(trimmed);
      this.newOption = '';
    }
  }

  removeOption(index: number): void {
    this.options.splice(index, 1);
  }

  spin(): void {
    if (this.options.length < 2) return;

    this.isSpinning = true;
    this.result = null;

    this.spinnerService.spin(this.options).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.result = res.result;
          this.isSpinning = false;
        }, 1500); // simulate spin time
      },
      error: (err) => {
        console.error('Spin failed', err);
        this.isSpinning = false;
      }
    });
  }
}
