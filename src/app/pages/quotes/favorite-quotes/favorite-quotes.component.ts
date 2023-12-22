import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';
import { db } from '../../../../database/db';
import { QuoteType } from '../../../type/quote.type';

@Component({
  selector: 'app-favorite-quotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-quotes.component.html',
  styleUrl: './favorite-quotes.component.scss',
})
export class FavoriteQuotesComponent {
  favoriteQuote$ = liveQuery(() => db.favoriteQuote.toArray());
  favoriteQuoteList: Signal<QuoteType[]> = toSignal(this.favoriteQuote$, {
    initialValue: [],
  });
}
