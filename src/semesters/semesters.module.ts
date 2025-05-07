
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SemesterController } from './interfaces/controllers/semester.controller';
import { SemesterService } from './application/services/semester.service';
import { SupabaseSemesterRepository } from './infrastructure/repositories/supabase-semester.repository';
import { SemesterRepository } from './domain/repositories/semester.repository.interface';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [ConfigModule, CoursesModule],
  controllers: [SemesterController],
  providers: [
    SemesterService,
    {
      provide: SemesterRepository,
      useClass: SupabaseSemesterRepository,
    },
  ],
  exports: [SemesterService],
})
export class SemestersModule {}
