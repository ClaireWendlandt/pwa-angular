import Dexie, { Table } from 'dexie';
import { LocalDbType } from '../app/type/db.type';
import { ProductType } from '../app/type/product.type';
import { QuoteType } from '../app/type/quote.type';

export class AppDB extends Dexie {
  productCached!: Table<ProductType>;
  waitingProduct!: Table<ProductType & { localDbId: number }>;
  favoriteQuote!: Table<QuoteType>;

  constructor() {
    super('ngdexieliveQuery');
    // this.recreateDB();
    this.version(12).stores({
      productCached: '++id',
      waitingProduct: '++localDbId, id',
      favoriteQuote: '++localDbId, id',
    });
  }

  /**
   * in case I need to reinitialize all my database
   */
  recreateDB() {
    return this.delete().then(() => this.open());
  }

  async getTableLine<Type>(tableName: string, id: number): Promise<Type> {
    const tableLine = await this.table(tableName).get(id);
    return tableLine;
  }

  async getTableLineByWhere<Type>(
    tableName: string,
    key: keyof Type,
    value: number
  ): Promise<Type> {
    return await this.table(tableName)
      .where(key.toString())
      .equals(value)
      .first();
  }

  async countTableLines(tableName: string): Promise<number> {
    const tableCount = await this.table(tableName).count();
    return tableCount;
  }

  async addTableLines<Type>(tableName: string, item: Type): Promise<void> {
    this.table(tableName).add(item);
  }

  async bulkPutTableLines<Type>(
    tableName: string,
    items: Type[]
  ): Promise<void> {
    try {
      await db.transaction('rw', this.table(tableName), async () => {
        for (const item of items) {
          await this.table(tableName).put(item);
        }
      });
    } catch (error) {
      console.error('Error during bulk put operation:', error);
      // Handle the error
    }
  }

  async updateTableLines<Type>(
    tableName: string,
    item: Type & LocalDbType
  ): Promise<void> {
    this.table(tableName).update(item.localDbId, item);
  }

  async deleteTable(tableName: string): Promise<void> {
    this.table(tableName).clear();
  }

  async deleteTableLines(
    tableName: string,
    key: number | string
  ): Promise<void> {
    this.table(tableName).delete(key);
  }
}

export const db = new AppDB();
