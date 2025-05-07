
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TutoringSessionController } from './interfaces/controllers/tutoring-session.controller';
import { TutoringSessionService } from './application/services/tutoring-session.service';
import { SupabaseTutoringSessionRepository } from './infrastructure/repositories/supabase-tutoring-session.repository';
import { TutoringSessionRepository } from './domain/repositories/tutoring-session.repository.interface';

@Module({
  imports: [ConfigModule],
  controllers: [TutoringSessionController],
  providers: [
    TutoringSessionService,
    {
      provide: TutoringSessionRepository,
      useClass: SupabaseTutoringSessionRepository,
    },
  ],
  exports: [TutoringSessionService],
})
export class TutoringModule {}
