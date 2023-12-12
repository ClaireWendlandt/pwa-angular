import { Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from '../../../database/db';
import { NetworkRetryService } from '../networkRetry/network-retry.service';

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  isUserOnline = signal(navigator.onLine ? true : false);
  // isUserOnline: WritableSignal<boolean | undefined> = signal(undefined);

  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  constructor(
    private rendererFactory2: RendererFactory2,
    private networkRetryService: NetworkRetryService
  ) {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.listenOnline(renderer);
    console.log('isUserOnline', this.isUserOnline());
  }

  async isOnline() {
    try {
      const request = new URL('self.location.origin');
      const response = await fetch(request.toString(), {
        method: 'HEAD',
        mode: 'no-cors',
      });

      if (response.status === 200) {
        console.log('Je passe ici 1');
        this.isUserOnline.set(true); // Internet connection is active
      } else {
        console.log('Je passe ici 2');
        this.isUserOnline.set(false);
      }
    } catch (error) {
      this.isUserOnline.set(false);
    }
  }

  listenOnline(renderer: Renderer2) {
    console.log('coucou???');
    // this.isOnline();
    renderer.listen('window', 'online', () => {
      console.log('je passe la ???');
      this.isUserOnline.set(true);
    });
    renderer.listen('window', 'offline', () => {
      console.log('je passe ici ???');

      this.isOnline();
    });
  }
}
