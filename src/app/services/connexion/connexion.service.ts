import { Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from '../../../database/db';
import { NetworkRetryService } from '../networkRetry/network-retry.service';

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  isUserOnline = signal(navigator.onLine);
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  constructor(
    private rendererFactory2: RendererFactory2,
    private networkRetryService: NetworkRetryService
  ) {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.listenOnline(renderer);
  }

  listenOnline(renderer: Renderer2) {
    renderer.listen('window', 'online', () => {
      this.isUserOnline.set(true);
      this.networkRetryService.sendPendingRequests();
    });

    renderer.listen('window', 'offline', () => {
      this.isUserOnline.set(false);
    });
  }
}
