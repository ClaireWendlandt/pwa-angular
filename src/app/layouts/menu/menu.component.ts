import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  items = [
    { label: 'Home', disabled: false },
    { label: 'Products', disabled: false },
    { label: 'Quotes', disabled: false },
    { label: 'Logout', disabled: true },
  ];

  activeLink: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUrl: string = this.router.url.substring(1);
    this.activeLink =
      this.items?.find((item) => item.label?.toLowerCase() === currentUrl)
        ?.label || '';
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName.toLowerCase()}`]);
    if (this.activeLink) {
      this.activeLink = pageName;
    }
  }
}
