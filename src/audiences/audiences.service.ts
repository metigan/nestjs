import { Injectable, Inject } from '@nestjs/common';
import { HttpClientService } from '../core/http-client.service';
import {
  Audience,
  CreateAudienceOptions,
  AudienceListResponse,
  AudienceStats,
  PaginationOptions,
} from '../types/audience.types';
import { ValidationError } from '../errors';

@Injectable()
export class AudiencesService {
  constructor(
    @Inject(HttpClientService)
    private readonly httpClient: HttpClientService,
  ) {}

  async create(options: CreateAudienceOptions): Promise<Audience> {
    if (!options.name) {
      throw new ValidationError('name is required', 'name');
    }

    return this.httpClient.post<Audience>('/api/audiences', options);
  }

  async get(audienceId: string): Promise<Audience> {
    if (!audienceId) {
      throw new ValidationError('audience ID is required', 'audienceId');
    }

    return this.httpClient.get<Audience>(`/api/audiences/${audienceId}`);
  }

  async list(options: PaginationOptions): Promise<AudienceListResponse> {
    const params = new URLSearchParams();

    if (options.page) {
      params.append('page', options.page.toString());
    }
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/audiences?${queryString}` : '/api/audiences';

    return this.httpClient.get<AudienceListResponse>(endpoint);
  }

  async getStats(audienceId: string): Promise<AudienceStats> {
    if (!audienceId) {
      throw new ValidationError('audience ID is required', 'audienceId');
    }

    return this.httpClient.get<AudienceStats>(`/api/audiences/${audienceId}/stats`);
  }

  async delete(audienceId: string): Promise<void> {
    if (!audienceId) {
      throw new ValidationError('audience ID is required', 'audienceId');
    }

    await this.httpClient.delete(`/api/audiences/${audienceId}`);
  }
}

