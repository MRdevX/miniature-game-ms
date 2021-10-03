import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { IMessaging } from '@root/models/messaging/messaging.interface';

export class MessageQueueService {
  constructor(
    @InjectQueue('miniature-messages')
    private messageQueue: Queue,
  ) {}

  public discountAndPurge(messaging: IMessaging) {
    return this.messageQueue.add('discount-and-purge', messaging);
  }
}
