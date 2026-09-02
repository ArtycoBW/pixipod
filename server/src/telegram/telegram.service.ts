import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateLeadDto } from '../leads/create-lead.dto';

type LeadMeta = { ip: string; userAgent: string };

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly config: ConfigService) {}

  async sendLead(lead: CreateLeadDto, meta: LeadMeta) {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
    if (!token || !chatId) {
      this.logger.error('Telegram delivery is not configured');
      throw new ServiceUnavailableException('Канал отправки временно не настроен.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const text = [
      '<b>Новая заявка с сайта PixiPod</b>',
      '',
      `<b>Имя:</b> ${this.escape(lead.name)}`,
      `<b>Контакт:</b> ${this.escape(lead.contact)}`,
      '',
      '<b>О проекте:</b>',
      this.escape(lead.project),
      '',
      `<b>Время:</b> ${this.escape(new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }))} МСК`,
      `<b>IP:</b> ${this.escape(meta.ip)}`,
      `<b>Браузер:</b> ${this.escape(meta.userAgent.slice(0, 300))}`,
    ].join('\n');

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const payload = await response.text();
        this.logger.error(`Telegram API rejected the message (${response.status}): ${payload.slice(0, 240)}`);
        throw new Error('Telegram API error');
      }
    } catch (error) {
      this.logger.error('Could not deliver lead to Telegram', error instanceof Error ? error.stack : undefined);
      throw new ServiceUnavailableException('Не удалось доставить заявку.');
    } finally {
      clearTimeout(timeout);
    }
  }

  private escape(value: string) {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }
}
