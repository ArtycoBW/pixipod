import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeadsController } from './leads/leads.controller';
import { MailService } from './mail/mail.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [LeadsController],
  providers: [MailService],
})
export class AppModule {}
