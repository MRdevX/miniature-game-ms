import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { MessageQueueService } from './message.queue.service';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
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
      redis: {
        db: 15,
        enableReadyCheck: true,
      },
    }),
    BullModule.registerQueue({
      name: 'miniature-messages',
    }),
  ],
  providers: [MessageQueueService],
  exports: [MessageQueueService],
})
export class MessagingModule {}
