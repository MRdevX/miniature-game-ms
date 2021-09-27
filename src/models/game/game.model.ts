import { IBaseEntity } from '@root/app/common/base/base-entity.model';
import { IPublisher } from '@root/models/publisher/publisher.model';

export interface IGame extends IBaseEntity {
  title: string;
  price: number;
  publisher: IPublisher;
  tags: string[];
  releaseDate: Date;
}
