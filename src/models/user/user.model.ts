import { IBaseEntity } from '@root/app/common/base/base-entity.model';
export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  title: string;
}
