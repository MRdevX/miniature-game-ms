import { IPayloadBase } from './base.payload';

export interface IMessaging {
  context?: string;
  payload?: IPayloadBase;
}
