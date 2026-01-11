import { DynamicModule, Global, Module } from '@nestjs/common';
import { MetiganService } from './metigan.service';
import { HttpClientService } from './core/http-client.service';
import { EmailService } from './email/email.service';
import { ContactsService } from './contacts/contacts.service';
import { AudiencesService } from './audiences/audiences.service';
import { TemplatesService } from './templates/templates.service';
import { FormsService } from './forms/forms.service';
import {
  MetiganModuleOptions,
  MetiganModuleAsyncOptions,
} from './interfaces/metigan-module-options.interface';

@Global()
@Module({})
export class MetiganModule {
  static forRoot(options: MetiganModuleOptions): DynamicModule {
    return {
      module: MetiganModule,
      providers: [
        {
          provide: 'METIGAN_MODULE_OPTIONS',
          useValue: options,
        },
        HttpClientService,
        EmailService,
        ContactsService,
        AudiencesService,
        TemplatesService,
        FormsService,
        MetiganService,
      ],
      exports: [MetiganService],
    };
  }

  static forRootAsync(options: MetiganModuleAsyncOptions): DynamicModule {
    return {
      module: MetiganModule,
      imports: options.inject || [],
      providers: [
        {
          provide: 'METIGAN_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        HttpClientService,
        EmailService,
        ContactsService,
        AudiencesService,
        TemplatesService,
        FormsService,
        MetiganService,
      ],
      exports: [MetiganService],
    };
  }
}

