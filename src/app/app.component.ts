import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckForUpdateService } from './services/checkForUpdate/check-for-update.service';
import { ConnexionService } from './services/connexion/connexion.service';
import { LogUpdateService } from './services/logUpdate/log-update.service';
import { NetworkRetryService } from './services/networkRetry/network-retry.service';
import { PromptUpdateService } from './services/promptUpdate/prompt-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private logUpdateService: LogUpdateService,
    private checkForUpdate: CheckForUpdateService,
    private promptUpdateService: PromptUpdateService,
    private networkRetryService: NetworkRetryService,
    private connexionService: ConnexionService
  ) {}

  get isOnline() {
    return this.connexionService.isUserOnline();
  }
}
