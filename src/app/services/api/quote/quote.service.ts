import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteAPI } from '../../../enums/enums';
import { QuoteType } from '../../../type/quote.type';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //   productCached$ = liveQuery(() => db.productCached.toArray());
  //   waitingProduct$ = liveQuery(() => db.waitingProduct.toArray());

  getOneQuote(category: string) {
    const headers = new HttpHeaders({
      'X-Api-Key': QuoteAPI.ApiKey,
    });

    return this.httpClient.get<QuoteType[]>(
      `${QuoteAPI.QuoteGetByCategory}${category}`,
      { headers: headers }
    );
  }
}
