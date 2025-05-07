import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { CoursesModule } from './courses/courses.module';
import { SemestersModule } from './semesters/semesters.module';
import { SeederModule } from './database/seeder/seeder.module';
import { TutoringModule } from './tutoring/tutoring.module';


@Module({
  imports: [  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  ProfilesModule,
  CoursesModule,
  SemestersModule,
  TutoringModule,
  AuthModule,
  StorageModule,
  SeederModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
