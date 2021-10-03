import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherModule } from '@root/app/publisher/publisher.module';
import { GameAdminController } from './game-admin.controller';
import { GamePublisherController } from './game-publisher.controller';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), PublisherModule],
  controllers: [GameController, GamePublisherController, GameAdminController],
  providers: [GameService],
})
export class GameModule {}
