import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent {}
