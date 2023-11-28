import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckForUpdateService } from './services/check-for-update.service';
import { LogUpdateService } from './services/log-update.service';
import { PromptUpdateService } from './services/prompt-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pwa-angudldkllar';

  constructor(
    private logUpdateService: LogUpdateService,
    private checkForUpdate: CheckForUpdateService,
    private promptUpdateService: PromptUpdateService
  ) {}
}
