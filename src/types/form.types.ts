export type FormFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'phone'
  | 'url'
  | 'file';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: string[];
}

export interface FormSettings {
  successMessage?: string;
  processingMessage?: string;
  redirectUrl?: string;
  notifyEmail?: string;
  enableCaptcha?: boolean;
  storeResponses?: boolean;
  allowMultipleSubmissions?: boolean;
}

export interface Form {
  id?: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings?: FormSettings;
  published?: boolean;
  publishedUrl?: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormSubmissionOptions {
  formId: string;
  data: Record<string, any>;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface FormListResponse {
  forms: Form[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

