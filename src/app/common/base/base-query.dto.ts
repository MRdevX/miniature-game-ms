import { IBaseQueryDto } from './base-query.interface';

export abstract class BaseEntityQueryDto<T> implements IBaseQueryDto<T> {
  get selectFields(): (keyof T)[] {
    return [];
  }
}
