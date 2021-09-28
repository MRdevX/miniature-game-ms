import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePublisherController } from './game-publisher.controller';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController, GamePublisherController],
  providers: [GameService],
})
export class GameModule {}
