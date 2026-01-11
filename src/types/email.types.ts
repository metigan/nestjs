export interface Attachment {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface EmailOptions {
  from: string;
  recipients: string[];
  subject: string;
  content: string;
  attachments?: Attachment[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  trackingId?: string;
}

export interface EmailSuccessResponse {
  success: true;
  message: string;
  successfulEmails: {
    recipient: string;
    trackingId: string;
  }[];
  failedEmails: {
    recipient: string;
    error: string;
  }[];
  recipientCount: number;
  emailsRemaining: number;
}

export interface EmailErrorResponse {
  error: string;
  message: string;
}

export interface ApiKeyErrorResponse {
  error: string;
}

export type EmailApiResponse = EmailSuccessResponse | EmailErrorResponse | ApiKeyErrorResponse;

