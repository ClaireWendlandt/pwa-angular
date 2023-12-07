import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConnexionService } from '../../services/connexion/connexion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private connexionService: ConnexionService) {}

  get isOnline() {
    return this.connexionService.isUserOnline();
  }
}
