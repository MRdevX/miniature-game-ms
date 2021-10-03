import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { IMessaging } from './interface/messaging.interface';

export class MessageQueueService {
  constructor(
    @InjectQueue('purge-and-discount')
    private discountQueue: Queue,
  ) {}

  public sendMessage(messaging: IMessaging) {
    return this.discountQueue.add('sendMessage', messaging);
  }
}
