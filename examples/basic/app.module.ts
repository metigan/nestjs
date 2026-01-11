import { Module } from '@nestjs/common';
import { MetiganModule } from '@metigan/nestjs';
import { EmailService } from './email.service';

@Module({
  imports: [
    MetiganModule.forRoot({
      apiKey: process.env.METIGAN_API_KEY || '',
    }),
  ],
  providers: [EmailService],
})
export class AppModule {}

