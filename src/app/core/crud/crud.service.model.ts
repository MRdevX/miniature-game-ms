import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, UpdateResult } from 'typeorm';
import { BaseEntitySearchDto } from '@root/app/common/base/base-search.dto';
import { SearchConfig } from '@root/app/common/interface/search.config.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICrudService<T> {
  search(options: BaseEntitySearchDto<T>, config?: SearchConfig): Promise<{ items: T[]; total: number }>;
  count(filter?: FindManyOptions<T>): Promise<number>;
  findAll(filter?: FindManyOptions<T>): Promise<T[]>;
  findOne(id: string | number | FindOneOptions<T> | FindConditions<T>, options?: FindOneOptions<T>): Promise<T>;
  findById(id: string, options?: FindOneOptions<T>): Promise<T>;
  create(entity: DeepPartial<T>, ...options: any[]): Promise<T>;
  update(id: any, entity: QueryDeepPartialEntity<T>, ...options: any[]): Promise<UpdateResult | T>;
  delete(id: any, ...options: any[]): Promise<DeleteResult>;
}
