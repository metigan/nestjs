import { Injectable } from '@nestjs/common';
import { MetiganService } from '@metigan/nestjs';

@Injectable()
export class EmailService {
  constructor(private readonly metigan: MetiganService) {}

  async sendWelcomeEmail(email: string) {
    const result = await this.metigan.email.sendEmail({
      from: 'Sender <sender@example.com>',
      recipients: [email],
      subject: 'Welcome!',
      content: '<h1>Hello!</h1><p>Thank you for signing up.</p>',
    });

    return result;
  }
}

