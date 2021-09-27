import { IBaseEntity } from '@root/app/common/base/base-entity.model';

export interface IGame extends IBaseEntity {
  title: string;
  price: number;
  publisher: any;
  tags: string[];
  releaseDate: Date;
}
