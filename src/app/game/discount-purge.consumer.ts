import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IMessaging } from '@root/models/messaging/messaging.interface';
import { UtilService } from '@root/app/core/util/util.service';
import { GameService } from './game.service';

@Processor('miniature-messages')
export class DiscountAndPurgeConsumer {
  constructor(private readonly gameService: GameService, private readonly utilService: UtilService) {}

  @Process('discount-and-purge')
  async discountAndPurgeJob(job: Job<unknown>) {
    const jobData: IMessaging = job.data;
    const { discountPercentage, discountStartMonth, discountEndMonth, deleteOlderThan } = jobData.payload;
    const games = await this.gameService.getAll();
    await Promise.all(
      games.map(async (game) => {
        const duration = this.utilService.getDuration(game.releaseDate);
        if (duration > deleteOlderThan) {
          console.log(`${game.title} with ${duration} month(s) age, Deleted!`);
          await this.gameService.delete(game.id);
        }
        if (duration <= discountEndMonth && duration >= discountStartMonth) {
          console.log(`${game.title} with ${duration} month(s) age, Discounted!`);
          await this.gameService.applyDiscount(game, discountPercentage);
        }
      }),
    );
  }
}
