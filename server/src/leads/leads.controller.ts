import { Body, Controller, Headers, HttpException, HttpStatus, Ip, Post } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateLeadDto } from './create-lead.dto';

@Controller('api/leads')
export class LeadsController {
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly mail: MailService) {}

  @Post()
  async create(
    @Body() lead: CreateLeadDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent = 'unknown',
  ) {
    if (lead.website) return { ok: true };
    this.assertRateLimit(ip);
    await this.mail.sendLead(lead, { ip, userAgent });
    return { ok: true };
  }

  private assertRateLimit(ip: string) {
    const now = Date.now();
    const windowStart = now - 60_000;
    const recent = (this.attempts.get(ip) || []).filter((timestamp) => timestamp > windowStart);
    if (recent.length >= 5) {
      throw new HttpException('Слишком много заявок. Попробуйте через минуту.', HttpStatus.TOO_MANY_REQUESTS);
    }
    recent.push(now);
    this.attempts.set(ip, recent);
  }
}
