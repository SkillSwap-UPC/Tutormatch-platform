import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { StorageController } from './interfaces/controllers/storage.controller';
import { AvatarService } from './application/services/avatar.service';
import { SupabaseStorageRepository } from './infrastructure/repositories/supabase-storage.repository';
import { ProfilesModule } from '../profiles/profiles.module';
import { ProfileService } from '../profiles/application/services/profile.service';
import { StorageService } from './storage.service';
import { STORAGE_REPOSITORY } from './constants/storage.constants';
import * as path from 'path';
import * as fs from 'fs';

// Crear directorio temporal si no existe
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

@Module({
  imports: [
    ConfigModule,
    ProfilesModule,
    MulterModule.register({
      dest: tmpDir,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
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
  ],
  exports: [AvatarService, StorageService, STORAGE_REPOSITORY],
})
export class StorageModule {}