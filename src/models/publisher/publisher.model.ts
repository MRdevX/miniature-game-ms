import { IBaseEntity } from '@root/app/common/base/base-entity.model';

export interface IPublisher extends IBaseEntity {
  name: string;
  siret: string;
  phone: string;
}
