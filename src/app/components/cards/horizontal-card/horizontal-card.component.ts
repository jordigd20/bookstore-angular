import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horizontal-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './horizontal-card.component.html',
})
export class HorizontalCardComponent {
  @Input() isEven: boolean = false;
}
