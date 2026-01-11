import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { ContactsService } from './contacts/contacts.service';
import { AudiencesService } from './audiences/audiences.service';
import { TemplatesService } from './templates/templates.service';
import { FormsService } from './forms/forms.service';

@Injectable()
export class MetiganService {
  constructor(
    public readonly email: EmailService,
    public readonly contacts: ContactsService,
    public readonly audiences: AudiencesService,
    public readonly templates: TemplatesService,
    public readonly forms: FormsService,
  ) {}
}

