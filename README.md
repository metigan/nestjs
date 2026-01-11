# Metigan NestJS SDK

[![npm version](https://img.shields.io/npm/v/@metigan/nestjs)](https://www.npmjs.com/package/@metigan/nestjs)
[![npm downloads](https://img.shields.io/npm/dm/@metigan/nestjs)](https://www.npmjs.com/package/@metigan/nestjs)
[![License](https://img.shields.io/npm/l/@metigan/nestjs)](LICENSE)

Official Metigan SDK for NestJS. Send emails, manage contacts, audiences, templates, and forms with ease in your NestJS applications.

## ✨ Features

- 📧 **Send Emails** - Send HTML emails with attachments, CC, BCC, and templates
- 👥 **Manage Contacts** - Create, update, list, and manage contact subscriptions
- 🎯 **Audiences** - Organize contacts into audiences and track statistics
- 📝 **Forms** - Submit and manage form data
- 🎨 **Templates** - Use email templates with dynamic variables
- 🔄 **Automatic Retry** - Built-in retry logic for failed requests
- ⚡ **TypeScript** - Full TypeScript support with type definitions
- 🛡️ **Error Handling** - Comprehensive exception handling
- 🏗️ **NestJS Integration** - Native NestJS module with dependency injection

## 📦 Installation

```bash
npm install @metigan/nestjs
# or
yarn add @metigan/nestjs
# or
pnpm add @metigan/nestjs
```

## 🚀 Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { MetiganModule } from '@metigan/nestjs';

@Module({
  imports: [
    MetiganModule.forRoot({
      apiKey: process.env.METIGAN_API_KEY,
    }),
  ],
})
export class AppModule {}
```

### 2. Use in Your Service

```typescript
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

    if (result.success) {
      console.log('Email sent successfully!');
      console.log(`Emails remaining: ${result.emailsRemaining}`);
    }

    return result;
  }
}
```

## ⚙️ Configuration

```typescript
MetiganModule.forRoot({
  apiKey: process.env.METIGAN_API_KEY,
  timeout: 30000,     // Optional, defaults to 30000ms
  retryCount: 3,      // Optional, defaults to 3 retries
  retryDelay: 2000,   // Optional, defaults to 2000ms between retries
  debug: false,       // Optional, enables debug logging
})
```

### Getting Your API Key

Get your API key from the [Metigan Dashboard](https://app.metigan.com/api-keys).

### Async Configuration

For dynamic configuration (e.g., using ConfigService):

```typescript
import { ConfigService } from '@nestjs/config';

MetiganModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    apiKey: configService.get<string>('METIGAN_API_KEY'),
    timeout: configService.get<number>('METIGAN_TIMEOUT', 30000),
    retryCount: configService.get<number>('METIGAN_RETRY_COUNT', 3),
    retryDelay: configService.get<number>('METIGAN_RETRY_DELAY', 2000),
  }),
  inject: [ConfigService],
})
```

## 📧 Sending Emails

### Basic Email

```typescript
const result = await this.metigan.email.sendEmail({
  from: 'Sender <sender@example.com>',
  recipients: ['recipient@example.com'],
  subject: 'Email Subject',
  content: '<h1>HTML Content</h1><p>This is the email body.</p>',
});

if (result.success) {
  console.log(`Email sent! Remaining: ${result.emailsRemaining}`);
}
```

### Email with CC and BCC

```typescript
const result = await this.metigan.email.sendEmail({
  from: 'Company <company@example.com>',
  recipients: ['main@example.com'],
  subject: 'Meeting Invitation',
  content: 'You\'re invited to our meeting.',
  cc: ['copy@example.com'],
  bcc: ['hidden@example.com'],
  replyTo: 'reply@example.com',
});
```

### Email with Attachments

```typescript
import * as fs from 'fs';

const fileData = fs.readFileSync('document.pdf');

const result = await this.metigan.email.sendEmail({
  from: 'Company <company@example.com>',
  recipients: ['customer@example.com'],
  subject: 'Important Document',
  content: 'Please find the document attached.',
  attachments: [
    {
      buffer: fileData,
      originalname: 'document.pdf',
      mimetype: 'application/pdf',
    },
  ],
});
```

### Email with Template

```typescript
const variables = {
  name: 'John Doe',
  company: 'Acme Inc',
};

const result = await this.metigan.email.sendEmailWithTemplate(
  'template-123',
  variables,
  {
    from: 'Sender <sender@example.com>',
    recipients: ['recipient@example.com'],
    replyTo: 'reply@example.com',
  },
);
```

## 👥 Managing Contacts

### Create Contact

```typescript
const contact = await this.metigan.contacts.create({
  email: 'new@example.com',
  audienceId: 'audience-123',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+1234567890',
  tags: ['customer', 'newsletter'],
  customFields: { company: 'Acme Inc' },
  status: 'subscribed',
});
```

### Get Contact

```typescript
// Get by ID
const contact = await this.metigan.contacts.get('contact-456');

// Get by email
const contact = await this.metigan.contacts.getByEmail(
  'jane@example.com',
  'audience-123',
);
```

### List Contacts

```typescript
const result = await this.metigan.contacts.list({
  audienceId: 'audience-123',
  status: 'subscribed',
  tag: 'customer',
  search: 'john',
  page: 1,
  limit: 50,
});

console.log(`Total contacts: ${result.pagination.total}`);
result.contacts.forEach((contact) => {
  console.log(`${contact.email}: ${contact.firstName}`);
});
```

### Update Contact

```typescript
const updated = await this.metigan.contacts.update('contact-456', {
  firstName: 'Jane Marie',
  lastName: 'Smith',
  tags: ['customer', 'vip'],
  status: 'subscribed',
});
```

### Manage Subscription

```typescript
// Subscribe
await this.metigan.contacts.subscribe('contact-456');

// Unsubscribe
await this.metigan.contacts.unsubscribe('contact-456');
```

### Manage Tags

```typescript
// Add tags
await this.metigan.contacts.addTags('contact-456', ['vip', 'black-friday']);

// Remove tags
await this.metigan.contacts.removeTags('contact-456', ['test']);
```

### Delete Contact

```typescript
await this.metigan.contacts.delete('contact-456');
```

## 🎯 Managing Audiences

### Create Audience

```typescript
const audience = await this.metigan.audiences.create({
  name: 'Main Newsletter',
  description: 'Main subscriber list',
});
```

### Get Audience

```typescript
const audience = await this.metigan.audiences.get('audience-123');
```

### List Audiences

```typescript
const result = await this.metigan.audiences.list({
  page: 1,
  limit: 10,
});

result.audiences.forEach((audience) => {
  console.log(`${audience.name}: ${audience.count} contacts`);
});
```

### Get Audience Statistics

```typescript
const stats = await this.metigan.audiences.getStats('audience-123');

console.log(`Total: ${stats.total}`);
console.log(`Subscribed: ${stats.subscribed}`);
console.log(`Unsubscribed: ${stats.unsubscribed}`);
```

### Delete Audience

```typescript
await this.metigan.audiences.delete('audience-123');
```

## 🎨 Managing Templates

### Get Template

```typescript
const template = await this.metigan.templates.get('template-123');
```

### List Templates

```typescript
const templates = await this.metigan.templates.list({
  page: 1,
  limit: 10,
});

templates.forEach((template) => {
  console.log(`${template.name}: ${template.id}`);
});
```

## 📝 Managing Forms

### Submit Form

```typescript
const result = await this.metigan.forms.submit({
  formId: 'form-123',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like more information.',
  },
});

console.log(result.message);
```

### Get Form

```typescript
const form = await this.metigan.forms.get('form-123');
```

### List Forms

```typescript
const result = await this.metigan.forms.list({
  page: 1,
  limit: 10,
});

result.forms.forEach((form) => {
  console.log(`${form.name}: ${form.id}`);
});
```

## 🛡️ Error Handling

The SDK provides specific error types for different scenarios:

```typescript
import { ApiError, ValidationError } from '@metigan/nestjs';

try {
  const result = await this.metigan.email.sendEmail(options);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors (422)
    console.error(`Validation Error: ${error.message}`);
    if (error.field) {
      console.error(`Field: ${error.field}`);
    }
  } else if (error instanceof ApiError) {
    // Handle API errors (4xx, 5xx)
    console.error(`API Error: ${error.statusCode} - ${error.message}`);
    if (error.error) {
      console.error(`Error code: ${error.error}`);
    }
  } else {
    // Handle other errors
    console.error(`Unexpected error: ${error}`);
  }
}
```

### Error Types

- **`ValidationError`** - Thrown when request validation fails (422)
- **`ApiError`** - Thrown for API errors (4xx, 5xx)
- **`Error`** - Thrown for network or other unexpected errors

## 📋 Response Format

**Important:** The API returns all fields in **camelCase** format, not snake_case. Always use camelCase when accessing response data:

```typescript
// ✅ Correct
result.emailsRemaining
result.recipientCount
result.successfulEmails

// ❌ Incorrect
result.emails_remaining  // Will be undefined
result.recipient_count   // Will be undefined
```

## 🔧 Requirements

- Node.js 16+ or higher
- NestJS 10+
- TypeScript 4.5+

## 📚 API Documentation

For detailed API documentation, visit:
- [Full Documentation](https://docs.metigan.com)
- [API Reference](https://docs.metigan.com/api)

## 🤝 Support

- **Email:** support@metigan.com
- **Issues:** [GitHub Issues](https://github.com/metigan/nestjs/issues)
- **Documentation:** [https://docs.metigan.com](https://docs.metigan.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Metigan Homepage](https://metigan.com)
- [Documentation](https://docs.metigan.com)
- [API Reference](https://docs.metigan.com/api)
- [GitHub Repository](https://github.com/metigan/nestjs)
