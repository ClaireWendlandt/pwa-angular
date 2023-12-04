import { Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from '../../../database/db';

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  isUserOnline = signal(navigator.onLine);
  waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  constructor(private rendererFactory2: RendererFactory2) {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.listenOnline(renderer);
  }

  listenOnline(renderer: Renderer2) {
    renderer.listen('window', 'online', () => {
      this.isUserOnline.set(true);
      this.waitingProduct$.subscribe((waitingProduct) => {
        if (waitingProduct.length > 0) {
          waitingProduct.forEach((product) => {});
        }
      });
    });

    renderer.listen('window', 'offline', () => {
      this.isUserOnline.set(false);
    });
  }
}
