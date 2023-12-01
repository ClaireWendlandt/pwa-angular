import Dexie, { Table } from 'dexie';
import { ProductType } from '../app/type/product.type';

export class AppDB extends Dexie {
  productCached!: Table<ProductType>;
  waitingProduct!: Table<ProductType>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      productCached: '++id',
      waitingProduct: '++id',
    });
  }

  async getTableLine<Type>(tableName: string, id: string): Promise<Type> {
    const tableLine = await this.table(tableName).get(parseInt(id));
    console.log('table line :', tableLine);
    return tableLine;
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

  async addTableLines<Type>(tableName: string, item: Type): Promise<void> {
    this.table(tableName).add(item);
  }

  async updateTableLines<Type>(
    tableName: string,
    id: string,
    item: Type
  ): Promise<void> {
    this.table(tableName).update(id, { id: item });
  }
}

export const db = new AppDB();
