import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vertical-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vertical-card.component.html',
})
export class VerticalCardComponent {
  @Input() isEven: boolean = false;
}
