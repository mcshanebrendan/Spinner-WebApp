import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-wheel.component.html',
  styleUrls: ['./spinner-wheel.component.css']
})
export class SpinnerWheelComponent {
  @Input() options: string[] = [];
  @Input() rotation: number = 0;

  get anglePerSegment(): number {
    return 360 / this.options.length;
  }

  getPath(index: number): string {
    const angle = 2 * Math.PI / this.options.length;
    const x1 = Math.cos(index * angle) * 100;
    const y1 = Math.sin(index * angle) * 100;
    const x2 = Math.cos((index + 1) * angle) * 100;
    const y2 = Math.sin((index + 1) * angle) * 100;
    return `M0,0 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`;
  }

  getTextTransform(index: number): string {
    const angle = this.anglePerSegment * index + this.anglePerSegment / 2;
    const radius = 40; // Pull it inward a bit so it stays inside the slice
    return `rotate(${angle}) translate(${radius}, 0) rotate(90)`;
  }

  getColor(i: number): string {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];
    return colors[i % colors.length];
  }

  getFontSize(): number {
    if (this.options.length <= 6) return 14;
    if (this.options.length <= 8) return 12;
    if (this.options.length <= 10) return 10;
    return 8; // minimum readable size
  }

}
