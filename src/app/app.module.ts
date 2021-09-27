import { Module } from '@nestjs/common';
import { CoreModule } from '@root/app/core/core.module';
import { UserModule } from '@root/app/user/user.module';
import { GameModule } from './game/game.module';
import { PublisherModule } from './publisher/publisher.module';

const modules = [UserModule, GameModule, PublisherModule];

@Module({
  imports: [CoreModule, ...modules],
  controllers: [],
})
export class AppModule {}
