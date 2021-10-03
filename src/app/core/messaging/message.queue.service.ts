import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { IMessaging } from './interface/messaging.interface';

export class MessageQueueService {
  constructor(
    @InjectQueue(`${process.env.NODE_ENV || 'development'}_messages`)
    private messageQueue: Queue,
  ) {}

  public sendMessage(messaging: IMessaging) {
    return this.messageQueue.add('sendMessage', messaging);
  }
}
