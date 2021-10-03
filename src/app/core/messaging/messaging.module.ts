import { merge } from 'lodash';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { MessageQueueService } from './message.queue.service';

@Global()
@Module({})
export class MessagingModule {
  static forRoot(queueConfig: BullModuleOptions = {}): DynamicModule {
    const defaultOptions: BullModuleOptions = {
      limiter: {
        duration: 2000,
        max: 2,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: 60 * 1000,
        removeOnComplete: true,
        removeOnFail: true,
      },
      name: `${process.env.NODE_ENV || 'development'}_messages`,
      redis: {
        db: 15,
        enableReadyCheck: true,
      },
    };

    const queueOptions = merge(defaultOptions, queueConfig);

    return {
      imports: [BullModule.registerQueue(queueOptions)],
      module: MessagingModule,
      providers: [MessageQueueService],
      exports: [MessageQueueService],
    };
  }
}
