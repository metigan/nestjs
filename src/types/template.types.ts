export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content?: string;
  variables?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

