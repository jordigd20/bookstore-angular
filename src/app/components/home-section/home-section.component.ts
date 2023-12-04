import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-section.component.html',
})
export class HomeSectionComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) buttonText!: string;
  @Input({ required: true }) link!: string;
  @Input() queryParams: { [key: string]: string } | undefined;
}
