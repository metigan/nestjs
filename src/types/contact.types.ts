export type ContactStatus = 'subscribed' | 'unsubscribed' | 'pending' | 'bounced' | 'complained';

export interface Contact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: ContactStatus;
  audienceId: string;
  tags?: string[];
  customFields?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateContactOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  audienceId: string;
  tags?: string[];
  customFields?: Record<string, any>;
  status?: ContactStatus;
}

export interface UpdateContactOptions {
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  status?: ContactStatus;
}

export interface ContactListFilters {
  audienceId?: string;
  status?: ContactStatus;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ContactListResponse {
  contacts: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

