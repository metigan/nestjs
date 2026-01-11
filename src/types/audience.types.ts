export interface Audience {
  id?: string;
  name: string;
  description?: string;
  count: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAudienceOptions {
  name: string;
  description?: string;
}

export interface AudienceListResponse {
  audiences: Audience[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AudienceStats {
  total: number;
  subscribed: number;
  unsubscribed: number;
  pending: number;
  bounced: number;
  complained: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

