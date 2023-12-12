import { CommonModule } from '@angular/common';
import { Component, RendererFactory2, effect } from '@angular/core';
import { ConnexionService } from '../../services/connexion/connexion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private connexionService: ConnexionService,
    private rendererFactory2: RendererFactory2
  ) {
    effect(() => {
      this.connexionService.isUserOnline();
    });
  }
  get isOnline() {
    return this.connexionService.isUserOnline();
  }
}
