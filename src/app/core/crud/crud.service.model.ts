import { DeepPartial, DeleteResult, UpdateResult } from 'typeorm';

export interface ICrudService<T> {
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T>;
  update(id: string, entity: DeepPartial<T>): Promise<UpdateResult>;
  create<E extends DeepPartial<T>>(entity: E): Promise<T>;
  delete(id: string): Promise<DeleteResult>;
}
