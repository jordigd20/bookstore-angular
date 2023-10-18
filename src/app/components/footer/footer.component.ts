import { Component, Renderer2, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  renderer = inject(Renderer2);
  isDark = signal(false);

  ngOnInit() {
    this.isDark.set(document.documentElement.classList.contains('dark'));
  }

  toggleTheme() {
    if (!this.isDark()) {
      this.isDark.set(true);
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.isDark.set(false);
      this.renderer.removeClass(document.documentElement, 'dark');
    }
  }
}
