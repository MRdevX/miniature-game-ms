import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { IMessaging } from '@root/models/messaging/messaging.interface';

export class MessageQueueService {
  constructor(
    @InjectQueue('miniature-messages')
    private discountQueue: Queue,
  ) {}

  public sendMessage(messaging: IMessaging) {
    return this.discountQueue.add('sendMessage', messaging);
  }
}
