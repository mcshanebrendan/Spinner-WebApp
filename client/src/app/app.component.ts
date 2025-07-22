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
    this.addToHistory(selectedOption); 
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 4000); // match CSS transition: 4s

  
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
