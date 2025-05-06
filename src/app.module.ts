import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
