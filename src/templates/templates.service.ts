import { Injectable, Inject } from '@nestjs/common';
import { HttpClientService } from '../core/http-client.service';
import { EmailTemplate } from '../types/template.types';
import { PaginationOptions } from '../types/audience.types';
import { ValidationError } from '../errors';

@Injectable()
export class TemplatesService {
  constructor(
    @Inject(HttpClientService)
    private readonly httpClient: HttpClientService,
  ) {}

  async get(templateId: string): Promise<EmailTemplate> {
    if (!templateId) {
      throw new ValidationError('template ID is required', 'templateId');
    }

    return this.httpClient.get<EmailTemplate>(`/api/templates/${templateId}`);
  }

  async list(options: PaginationOptions): Promise<EmailTemplate[]> {
    const params = new URLSearchParams();

    if (options.page) {
      params.append('page', options.page.toString());
    }
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/templates?${queryString}` : '/api/templates';

    const result = await this.httpClient.get<{ templates: EmailTemplate[] }>(
      endpoint,
    );
    return result.templates;
  }
}

