import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ConnexionService } from '../../services/connexion/connexion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly connexionService = inject(ConnexionService);

  constructor() {
    effect(() => {
      this.connexionService.isUserOnline();
    });
  }
  get isOnline() {
    return this.connexionService.isUserOnline();
  }
}
