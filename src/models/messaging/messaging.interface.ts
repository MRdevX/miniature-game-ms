import { IMessagePayload } from './message.payload';

export interface IMessaging {
  context?: string;
  payload?: IMessagePayload;
}
