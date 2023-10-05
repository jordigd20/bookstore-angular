import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-background',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-background.component.html',
})
export class AuthBackgroundComponent {}
