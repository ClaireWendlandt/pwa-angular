import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { QuoteAPI } from '../../../enums/enums';
import { QuoteType } from '../../../type/quote.type';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly httpClient = inject(HttpClient);

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
