// DAO.ts
export interface DAO<T> {
  getAll(): Promise<T[]>;
  getByBlob(id: string): Promise<T | null>;
}
  // create(item: T): Promise<void>;
  // update(id: string, item: T): Promise<void>;
  // delete(id: string): Promise<void>;