import { LocalDbType } from './db.type';

export type QuoteType = {
  quote: string;
  author: string;
  category: string;
} & LocalDbType;
