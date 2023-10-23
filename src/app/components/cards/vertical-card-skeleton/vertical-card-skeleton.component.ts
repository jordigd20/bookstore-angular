import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vertical-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertical-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalCardSkeletonComponent {}
