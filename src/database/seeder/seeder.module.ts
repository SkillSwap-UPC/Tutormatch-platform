import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from '../../courses/courses.module';
import { SemestersModule } from '../../semesters/semesters.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule,
    CoursesModule,
    SemestersModule
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}