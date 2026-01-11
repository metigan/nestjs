import { Injectable, Inject } from '@nestjs/common';
import { HttpClientService } from '../core/http-client.service';
import {
  Contact,
  CreateContactOptions,
  UpdateContactOptions,
  ContactListFilters,
  ContactListResponse,
} from '../types/contact.types';
import { ValidationError } from '../errors';

@Injectable()
export class ContactsService {
  constructor(
    @Inject(HttpClientService)
    private readonly httpClient: HttpClientService,
  ) {}

  async create(options: CreateContactOptions): Promise<Contact> {
    if (!options.email) {
      throw new ValidationError('email is required', 'email');
    }
    if (!options.audienceId) {
      throw new ValidationError('audience ID is required', 'audienceId');
    }

    if (!options.status) {
      options.status = 'subscribed';
    }

    return this.httpClient.post<Contact>('/api/contacts', options);
  }

  async get(contactId: string): Promise<Contact> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }

    return this.httpClient.get<Contact>(`/api/contacts/${contactId}`);
  }

  async getByEmail(email: string, audienceId: string): Promise<Contact> {
    if (!email) {
      throw new ValidationError('email is required', 'email');
    }
    if (!audienceId) {
      throw new ValidationError('audience ID is required', 'audienceId');
    }

    return this.httpClient.get<Contact>(
      `/api/contacts/email/${email}?audienceId=${audienceId}`,
    );
  }

  async update(
    contactId: string,
    options: UpdateContactOptions,
  ): Promise<Contact> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }

    return this.httpClient.patch<Contact>(`/api/contacts/${contactId}`, options);
  }

  async list(filters: ContactListFilters): Promise<ContactListResponse> {
    const params = new URLSearchParams();

    if (filters.audienceId) {
      params.append('audienceId', filters.audienceId);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.tag) {
      params.append('tag', filters.tag);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/contacts?${queryString}` : '/api/contacts';

    return this.httpClient.get<ContactListResponse>(endpoint);
  }

  async delete(contactId: string): Promise<void> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }

    await this.httpClient.delete(`/api/contacts/${contactId}`);
  }

  async subscribe(contactId: string): Promise<void> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }

    await this.httpClient.post(`/api/contacts/${contactId}/subscribe`, {});
  }

  async unsubscribe(contactId: string): Promise<void> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }

    await this.httpClient.post(`/api/contacts/${contactId}/unsubscribe`, {});
  }

  async addTags(contactId: string, tags: string[]): Promise<void> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }
    if (!tags || tags.length === 0) {
      throw new ValidationError('at least one tag is required', 'tags');
    }

    await this.httpClient.post(`/api/contacts/${contactId}/tags`, { tags });
  }

  async removeTags(contactId: string, tags: string[]): Promise<void> {
    if (!contactId) {
      throw new ValidationError('contact ID is required', 'contactId');
    }
    if (!tags || tags.length === 0) {
      throw new ValidationError('at least one tag is required', 'tags');
    }

    await this.httpClient.delete(`/api/contacts/${contactId}/tags`, {
      data: { tags },
    });
  }
}

