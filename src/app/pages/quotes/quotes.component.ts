import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Renderer2,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { liveQuery } from 'dexie';
import { throwError } from 'rxjs';
import { db } from '../../../database/db';
import { favoriteQuoteKey } from '../../enums/enums';
import { QuoteService } from '../../services/api/quote/quote.service';
import { QuoteType } from '../../type/quote.type';
import { generateUniqId } from '../../utility/id.utility';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class QuotesComponent implements OnInit {
  primaryColor: string[] = [];
  quote: WritableSignal<QuoteType | undefined> = signal(undefined);
  addedToFavorite: WritableSignal<boolean> = signal(false);
  favoriteQuote$ = liveQuery(() => db.favoriteQuote.toArray());
  favoriteQuoteList: WritableSignal<QuoteType[]> = signal([]);

  categories = [
    'alone',
    'amazing',
    'art',
    'attitude',
    'best',
    'business',
    'change',
    'communication',
    'computers',
    'cool',
    'courage',
    'death',
    'design',
    'dreams',
    'environmental',
    'equality',
    'experience',
    'failure',
    'faith',
    'family',
    'famous',
    'fear',
    'food',
    'forgiveness',
    'freedom',
    'friendship',
    'funny',
    'future',
    'god',
    'good',
    'great',
    'happiness',
    'health',
    'history',
    'hope',
    'humor',
    'imagination',
    'inspirational',
    'intelligence',
    'knowledge',
    'leadership',
    'learning',
    'life',
    'love',
    'money',
    'movies',
    'success',
  ];
  constructor(
    private quoteService: QuoteService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getDynamicColor();
    this.favoriteQuote$.subscribe((quotes) => {
      this.favoriteQuoteList.set(quotes);
      console.log('favoirite list:', this.favoriteQuoteList());
    });
  }

  getRandomQuote(category: string): void {
    this.addedToFavorite.set(false);
    this.quoteService
      .getOneQuote(category)
      // .pipe(
      //   first()
      // )
      // .pipe(
      //   take(1),
      //   catchError(async ({ status }) => {
      //     if (status !== 200) {
      //       // this.usePendingDatas();
      //     }
      //     return throwError(status);
      //   })
      // )
      .subscribe({
        next: (quotes) => {
          if (quotes.length > 0) {
            this.quote.set(quotes[0]);
            console.log('next ;) :', this.quote());
          } else {
            console.log('No quotes found for category:', category);
          }
        },
        error: (e) => throwError(() => new Error(e)),
        complete: () => console.log('complete ;) :', this.quote()),
      });
    console.log('outside ;) :', this.quote());
  }

  getDynamicColor(): void {
    for (let i = 0; i < this.categories.length; i++) {
      const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`;
      this.primaryColor.push(color);
    }
  }

  addOrRemoveToFavorite() {
    if (this.addedToFavorite()) {
      this.addedToFavorite.set(false);
      db.deleteTableLines(favoriteQuoteKey, this.quote()?.localDbId as string);
    } else {
      const localDbId = generateUniqId();
      this.addedToFavorite.set(true);
      this.quote.set({
        ...(this.quote() as QuoteType),
        localDbId: localDbId,
      });
      db.addTableLines(favoriteQuoteKey, this.quote());
    }
  }
}
