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
  if (this.options.length < 2 || this.isSpinning) return;

  this.isSpinning = true;
  this.result = null;

  // Handle rotation
  const extraSpins = 5; // full spins
  const degrees = Math.floor(Math.random() * 360);
  const totalRotation = 360 * extraSpins + degrees;
  this.rotation += totalRotation;

  // Calculate result based on final angle
  const finalAngle = (360 - (this.rotation % 360)) % 360;
  const segmentAngle = 360 / this.options.length;
  const index = Math.floor(finalAngle / segmentAngle);
  const selectedOption = this.options[index];

  // Simulate delay for spin animation (should match CSS transition time)
  setTimeout(() => {
    this.result = selectedOption;
    this.isSpinning = false;
  }, 4000); // match CSS transition: 4s
}


  
}
