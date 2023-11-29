import Dexie, { Table } from 'dexie';
import { ProductType } from '../app/type/product.type';

export class AppDB extends Dexie {
  productCached!: Table<ProductType, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      productCached: '++id',
    });
  }

  async countTableLines(tableName: string): Promise<number> {
    const tableCount = await this.table(tableName).count();
    return tableCount;
  }

  async deleteTableLines(tableName: string): Promise<void> {
    this.table(tableName).clear();
  }

  async bulkAddTableLines<Type>(
    tableName: string,
    items: Type[]
  ): Promise<void> {
    this.table(tableName).bulkAdd(items);
  }
}

export const db = new AppDB();
