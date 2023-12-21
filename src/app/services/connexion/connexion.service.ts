import {
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
  signal,
} from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from '../../../database/db';
import { NetworkRetryService } from '../networkRetry/network-retry.service';

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  private readonly rendererFactory2 = inject(RendererFactory2);
  private readonly networkRetryService = inject(NetworkRetryService);

  isUserOnline = signal(navigator.onLine ? true : false);
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  constructor() {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.listenOnline(renderer);
  }

  async isOnline() {
    try {
      const request = new URL('self.location.origin');
      const response = await fetch(request.toString(), {
        method: 'HEAD',
        mode: 'no-cors',
      });

      if (response.status === 200) {
        this.isUserOnline.set(true); // Internet connection is active
      } else {
        this.isUserOnline.set(false);
      }
    } catch (error) {
      this.isUserOnline.set(false);
    }
  }

  listenOnline(renderer: Renderer2) {
    renderer.listen('window', 'online', () => {
      this.isUserOnline.set(true);
      this.networkRetryService.sendPendingRequests();
    });
    renderer.listen('window', 'offline', () => {
      this.isOnline();
    });
  }
}
