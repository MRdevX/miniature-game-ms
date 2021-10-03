import { Queue } from 'bull';
import { Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { IProviderOptions } from './interface/provider-options.interface';
import { IMessaging } from './interface/messaging.interface';

export class MessageQueueService {
  constructor(
    @InjectQueue(`${process.env.NODE_ENV || 'development'}_messages`)
    private messageQueue: Queue,
    @Inject('ProviderOptions')
    private readonly options: IProviderOptions,
  ) {}

  public sendMessage(messaging: IMessaging) {
    return this.messageQueue.add('sendMessage', { ...this.options, ...messaging });
  }
}
