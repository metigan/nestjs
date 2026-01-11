import { Injectable, Inject } from '@nestjs/common';
import { HttpClientService } from '../core/http-client.service';
import { EmailOptions, EmailSuccessResponse } from '../types/email.types';
import { ValidationError } from '../errors';

@Injectable()
export class EmailService {
  constructor(
    @Inject(HttpClientService)
    private readonly httpClient: HttpClientService,
  ) {}

  async sendEmail(options: EmailOptions): Promise<EmailSuccessResponse> {
    // Validate required fields
    if (!options.from) {
      throw new ValidationError('from field is required', 'from');
    }
    if (!options.recipients || options.recipients.length === 0) {
      throw new ValidationError('at least one recipient is required', 'recipients');
    }
    if (!options.subject) {
      throw new ValidationError('subject is required', 'subject');
    }
    if (!options.content) {
      throw new ValidationError('content is required', 'content');
    }

    // Process attachments - encode to base64
    const requestBody: any = {
      from: options.from,
      recipients: options.recipients,
      subject: options.subject,
      content: options.content,
    };

    if (options.attachments && options.attachments.length > 0) {
      requestBody.attachments = options.attachments.map((att) => ({
        content: att.buffer.toString('base64'),
        filename: att.originalname,
        contentType: att.mimetype,
      }));
    }

    if (options.cc && options.cc.length > 0) {
      requestBody.cc = options.cc;
    }

    if (options.bcc && options.bcc.length > 0) {
      requestBody.bcc = options.bcc;
    }

    if (options.replyTo) {
      requestBody.replyTo = options.replyTo;
    }

    if (options.trackingId) {
      requestBody.trackingId = options.trackingId;
    }

    return this.httpClient.post<EmailSuccessResponse>('/api/email/send', requestBody);
  }

  async sendEmailWithTemplate(
    templateId: string,
    variables: Record<string, any>,
    options: Omit<EmailOptions, 'content' | 'subject'>,
  ): Promise<EmailSuccessResponse> {
    if (!templateId) {
      throw new ValidationError('template ID is required', 'templateId');
    }

    const requestBody: any = {
      templateId,
      variables,
      from: options.from,
      recipients: options.recipients,
    };

    if (options.replyTo) {
      requestBody.replyTo = options.replyTo;
    }

    return this.httpClient.post<EmailSuccessResponse>(
      '/api/email/send',
      requestBody,
    );
  }
}

