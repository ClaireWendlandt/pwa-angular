import Dexie, { Table } from 'dexie';
import { LocalDbType } from '../app/type/db.type';
import { ProductType } from '../app/type/product.type';

export class AppDB extends Dexie {
  productCached!: Table<ProductType>;
  waitingProduct!: Table<ProductType & { localDbId: number }>;

  constructor() {
    super('ngdexieliveQuery');
    // this.recreateDB();
    this.version(1).stores({
      productCached: '++id',
      waitingProduct: '++localDbId, id',
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

  async deleteTableLines(tableName: string): Promise<void> {
    this.table(tableName).clear();
  }

  async bulkAddTableLines<Type>(
    tableName: string,
    items: Type[]
  ): Promise<void> {
    this.table(tableName).bulkAdd(items);
  }

  async addTableLines<Type>(
    tableName: string,
    item: Type & { pushMethodPWA?: string }
  ): Promise<void> {
    // remove this later, but really usefull for the moment for read datas and understand what's happening
    item.pushMethodPWA = 'POST';
    this.table(tableName).add(item);
  }

  async updateTableLines<Type>(
    tableName: string,
    item: Type & LocalDbType // & { pushMethodPWA?: string }
  ): Promise<void> {
    // remove this later, but really usefull for the moment for read datas and understand what's happening
    // item.pushMethodPWA = 'PUT';
    this.table(tableName).update(item.localDbId, item);
  }
}

export const db = new AppDB();
