import { DeepPartial, DeleteResult, FindConditions, FindOneOptions, UpdateResult } from 'typeorm';

export interface ICrudService<T> {
  getAll(): Promise<T[]>;
  findOne(id: string | number | FindOneOptions<T> | FindConditions<T>, options?: FindOneOptions<T>): Promise<T>;
  findById(id: string, options?: FindOneOptions<T>): Promise<T>;
  update(id: string, entity: DeepPartial<T>): Promise<UpdateResult>;
  create<E extends DeepPartial<T>>(entity: E): Promise<T>;
  delete(id: string): Promise<DeleteResult>;
}
