import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './database/db-config';
import { HealthModule } from './health/health.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), HealthModule, MessagingModule],
  providers: [],
  exports: [],
})
export class CoreModule {}
