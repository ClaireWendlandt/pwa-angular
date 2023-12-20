import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Renderer2,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
  primaryColor = '';
  quote: WritableSignal<QuoteType | undefined> = signal(undefined);
  addedToFavorite: WritableSignal<boolean> = signal(false);

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

  ngOnInit(): void {}

  getRandomQuote(category: string): void {
    this.quoteService
      .getOneQuote(category)
      // .pipe(
      //   take(1),
      //   catchError(async ({ status }) => {
      //     if (status !== 200) {
      //       // this.usePendingDatas();
      //     }
      //     return throwError(status);
      //   })
      // )
      .subscribe(
        (quotes: QuoteType[]) => {
          if (quotes.length > 0) {
            this.quote.set(quotes[0]);
            console.log('Quote:', quotes);
          } else {
            console.log('No quotes found for category:', category);
          }
        },
        (error) => {
          console.error('Error fetching quotes:', error);
        }
      );
  }

  getDynamicColor(): void {
    this.primaryColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`;
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
