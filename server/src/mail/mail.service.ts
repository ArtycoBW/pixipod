import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateLeadDto } from '../leads/create-lead.dto';

type LeadMeta = { ip: string; userAgent: string };

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendLead(lead: CreateLeadDto, meta: LeadMeta) {
    const host = this.config.get<string>('MAIL_HOST');
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASSWORD');
    const to = this.config.get<string>('LEADS_TO_EMAIL') || 'hellopixipod@mail.ru';

    if (!host || !user || !pass) {
      this.logger.error('Email delivery is not configured');
      throw new ServiceUnavailableException('Канал отправки временно не настроен.');
    }

    const port = Number(this.config.get<string>('MAIL_PORT') || 465);
    const secure = this.config.get<string>('MAIL_SECURE') !== 'false';
    const from = this.config.get<string>('MAIL_FROM') || `PixiPod <${user}>`;
    const submittedAt = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const text = [
      'Новая заявка с сайта PixiPod',
      '',
      `Имя: ${lead.name}`,
      `Контакт: ${lead.contact}`,
      '',
      'О проекте:',
      lead.project,
      '',
      `Время: ${submittedAt} МСК`,
      `IP: ${meta.ip}`,
      `Браузер: ${meta.userAgent.slice(0, 300)}`,
    ].join('\n');

    const html = [
      '<h2>Новая заявка с сайта PixiPod</h2>',
      `<p><strong>Имя:</strong> ${this.escape(lead.name)}<br>`,
      `<strong>Контакт:</strong> ${this.escape(lead.contact)}</p>`,
      `<p><strong>О проекте:</strong><br>${this.escape(lead.project).replaceAll('\n', '<br>')}</p>`,
      `<hr><p><small>Время: ${this.escape(submittedAt)} МСК<br>IP: ${this.escape(meta.ip)}<br>Браузер: ${this.escape(meta.userAgent.slice(0, 300))}</small></p>`,
    ].join('');

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    try {
      await transporter.sendMail({
        from,
        to,
        replyTo: user,
        subject: `Новая заявка PixiPod — ${lead.name.slice(0, 80)}`,
        text,
        html,
      });
    } catch (error) {
      this.logger.error('Could not deliver lead by email', error instanceof Error ? error.stack : undefined);
      throw new ServiceUnavailableException('Не удалось доставить заявку.');
    }
  }

  private escape(value: string) {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }
}
