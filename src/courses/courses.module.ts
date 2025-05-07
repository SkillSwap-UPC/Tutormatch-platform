
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseController } from './interfaces/controllers/course.controller';
import { CourseService } from './application/services/course.service';
import { SupabaseCourseRepository } from './infrastructure/repositories/supabase-course.repository';
import { CourseRepository } from './domain/repositories/course.repository.interface';

@Module({
  imports: [ConfigModule],
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: CourseRepository,
      useClass: SupabaseCourseRepository,
    },
  ],
  exports: [CourseService, CourseRepository],
})
export class CoursesModule {}
