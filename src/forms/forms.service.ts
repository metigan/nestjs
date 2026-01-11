import { Injectable, Inject } from '@nestjs/common';
import { HttpClientService } from '../core/http-client.service';
import {
  Form,
  FormSubmissionOptions,
  FormSubmissionResponse,
  FormListResponse,
} from '../types/form.types';
import { PaginationOptions } from '../types/audience.types';
import { ValidationError } from '../errors';

@Injectable()
export class FormsService {
  constructor(
    @Inject(HttpClientService)
    private readonly httpClient: HttpClientService,
  ) {}

  async submit(
    options: FormSubmissionOptions,
  ): Promise<FormSubmissionResponse> {
    if (!options.formId) {
      throw new ValidationError('form ID is required', 'formId');
    }
    if (!options.data) {
      throw new ValidationError('form data is required', 'data');
    }

    return this.httpClient.post<FormSubmissionResponse>(
      '/api/submissions',
      options,
    );
  }

  async get(formIdOrSlug: string): Promise<Form> {
    if (!formIdOrSlug) {
      throw new ValidationError('form ID or slug is required', 'formIdOrSlug');
    }

    return this.httpClient.get<Form>(`/api/forms/${formIdOrSlug}`);
  }

  async list(options: PaginationOptions): Promise<FormListResponse> {
    const params = new URLSearchParams();

    if (options.page) {
      params.append('page', options.page.toString());
    }
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/forms?${queryString}` : '/api/forms';

    return this.httpClient.get<FormListResponse>(endpoint);
  }
}

