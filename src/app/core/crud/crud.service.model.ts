import { DeleteResult, UpdateResult } from 'typeorm';

export interface ICrudService<T> {
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T>;
  update(id: string, entity: T): Promise<UpdateResult>;
  create(entity: T): Promise<T>;
  delete(id: string): Promise<DeleteResult>;
}
