import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './interfaces/controllers/profile.controller';
import { ProfileService } from './application/services/profile.service';
import { SupabaseProfileRepository } from './infrastructure/repositories/supabase-profile.repository';

export const PROFILE_REPOSITORY = 'PROFILE_REPOSITORY';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PROFILE_REPOSITORY,
      useClass: SupabaseProfileRepository,
    },
    {
      provide: ProfileService,
      useFactory: (repository) => new ProfileService(repository),
      inject: [PROFILE_REPOSITORY],
    },
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfilesModule {}