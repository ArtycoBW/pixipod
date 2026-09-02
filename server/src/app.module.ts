import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeadsController } from './leads/leads.controller';
import { TelegramService } from './telegram/telegram.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [LeadsController],
  providers: [TelegramService],
})
export class AppModule {}
