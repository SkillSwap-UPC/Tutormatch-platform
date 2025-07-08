import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageController } from './interfaces/controllers/storage.controller';
import { AvatarService } from './application/services/avatar.service';
import { SupabaseStorageRepository } from './infrastructure/repositories/supabase-storage.repository';
import { ProfilesModule } from '../profiles/profiles.module';
import { ProfileService } from '../profiles/application/services/profile.service';
import { StorageService } from './storage.service';
import { STORAGE_REPOSITORY } from './constants/storage.constants';
import { TutoringModule } from 'src/tutoring/tutoring.module';
import { TutoringImageService } from './application/services/tutoringImage.service';
import { TutoringSessionService } from 'src/tutoring/application/services/tutoring-session.service';
import { PaymentProofService } from './application/services/paymentProof.service';

@Module({
  imports: [
    ConfigModule,
    ProfilesModule,
    TutoringModule,
  ],
  controllers: [StorageController],
  providers: [
    {
      provide: STORAGE_REPOSITORY,
      useClass: SupabaseStorageRepository,
    },
    StorageService,
    {
      provide: AvatarService,
      useFactory: (storageRepository, profileService) => 
        new AvatarService(storageRepository, profileService),
      inject: [STORAGE_REPOSITORY, ProfileService],
    },
    {
      provide: TutoringImageService,
      useFactory: (storageRepository, tutoringSessionService) => 
        new TutoringImageService(storageRepository, tutoringSessionService),
      inject: [STORAGE_REPOSITORY, TutoringSessionService],
    },
    {
      provide: PaymentProofService,
      useFactory: (storageRepository) => new PaymentProofService(storageRepository),
      inject: [STORAGE_REPOSITORY],
    },
  ],
  exports: [AvatarService, TutoringImageService, StorageService, STORAGE_REPOSITORY, PaymentProofService],
})
export class StorageModule {}