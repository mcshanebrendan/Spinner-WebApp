import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerWheelComponent } from './spinner-wheel/spinner-wheel.component';
import confetti from 'canvas-confetti';

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
  history: string[] = [];
  selectedColors: string[] = [];


  constructor(private spinnerService: SpinnerService) {}

  addOption(): void {
  const trimmed = this.newOption.trim();
  if (trimmed) {
    this.options.push(trimmed);
    // Add a color for the new option (cycle through some colors or use a random one)
    const defaultColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c'];
    const color = defaultColors[this.options.length % defaultColors.length];
    this.selectedColors.push(color);

    this.newOption = '';
  }
}


  removeOption(index: number): void {
  this.options.splice(index, 1);
  this.selectedColors.splice(index, 1); // Keep colors in sync
}


  spin(): void {
  if (this.options.length < 2 || this.isSpinning) return;

  this.isSpinning = true;
  this.result = null;

  const segmentAngle = 360 / this.options.length;
  const randomIndex = Math.floor(Math.random() * this.options.length);
  const targetAngle = 360 * 5 + randomIndex * segmentAngle + segmentAngle / 2; // center of segment
  const startRotation = this.rotation;
  const endRotation = startRotation + targetAngle;
  const duration = 4000; // match CSS time

  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    this.rotation = startRotation + (endRotation - startRotation) * eased;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const finalAngle = (360 - (this.rotation % 360)) % 360;
      const finalIndex = Math.floor(finalAngle / segmentAngle);
      const selectedOption = this.options[finalIndex];

      this.result = selectedOption;
      this.isSpinning = false;
      this.addToHistory(selectedOption);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  requestAnimationFrame(animate);
}


ngOnInit() {
  const saved = localStorage.getItem('spinHistory');
  if (saved) {
    this.history = JSON.parse(saved);
  }
}

addToHistory(result: string): void {
    this.history.unshift(result); // most recent first
    if (this.history.length > 50) {
      this.history.pop(); // keep max 50 results
      localStorage.setItem('spinHistory', JSON.stringify(this.history));
    }
  }

  getLabel(index: number): string {
    if (index === 0) return 'Last spin';
    if (index === 1) return 'Second last spin';
    return `${index + 1} spins ago`;
  }

  exportHistoryAsCSV(): void {
  const csv = this.history.map((item, index) => `${index + 1},${item}`).join('\n');
  const blob = new Blob([`#,Spin Result\n${csv}`], { type: 'text/csv' });
  this.downloadFile(blob, 'spin-history.csv');
}

exportHistoryAsJSON(): void {
  const blob = new Blob([JSON.stringify(this.history, null, 2)], { type: 'application/json' });
  this.downloadFile(blob, 'spin-history.json');
}

private downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}


  
}
