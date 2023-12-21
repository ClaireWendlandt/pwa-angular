import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckForUpdateService } from './services/checkForUpdate/check-for-update.service';
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
  private readonly logUpdateService = inject(LogUpdateService);
  private readonly checkForUpdate = inject(CheckForUpdateService);
  private readonly promptUpdateService = inject(PromptUpdateService);
  private readonly networkRetryService = inject(NetworkRetryService);
}
