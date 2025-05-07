import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { StorageRepository } from '../../domain/repositories/storage-repository.interface';
import { StorageFile } from '../../domain/models/storage-file.model';
import { STORAGE_REPOSITORY } from '../../constants/storage.constants';
import { ProfileService } from '../../../profiles/application/services/profile.service';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class AvatarService {
  private readonly AVATARS_BUCKET = 'avatars';
  
  constructor(
    @Inject(STORAGE_REPOSITORY)
    private readonly storageRepository: StorageRepository,
    private readonly profileService: ProfileService,
  ) {
    // Inicializar el bucket de avatares (público para que sean accesibles)
    this.initAvatarBucket();
  }

  private async initAvatarBucket(): Promise<void> {
    await this.storageRepository.createBucket(this.AVATARS_BUCKET, true);
  }

  /**
   * Genera un nombre único para el archivo de avatar
   */
  private generateUniqueFileName(userId: string, originalFileName: string): string {
    const fileExt = path.extname(originalFileName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Formato de archivo no permitido. Use: jpg, jpeg, png, gif, webp');
    }
    
    // Generar nombre único: userId + timestamp + hash aleatorio + extensión
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${userId}-${timestamp}-${randomHash}${fileExt}`;
  }

  /**
   * Sube un avatar para un usuario y actualiza su perfil
   */
  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
    customFileName?: string
  ): Promise<StorageFile> {
    // Verificar que el usuario existe
    const profile = await this.profileService.findById(userId);
    
    // Generar nombre único para el archivo o usar el personalizado
    const fileName = customFileName || this.generateUniqueFileName(userId, file.originalname);
    const filePath = `${userId}/${fileName}`;
    
    // Subir archivo al bucket
    const storageFile = await this.storageRepository.uploadFile(
      this.AVATARS_BUCKET,
      filePath,
      file.buffer,
      file.mimetype
    );
    
    // Actualizar perfil del usuario con la URL del avatar
    await this.profileService.update(userId, {
      avatar: storageFile.url
    });
    
    return storageFile;
  }

  /**
   * Obtiene la URL del avatar de un usuario
   */
  async getAvatarUrl(userId: string, fileName: string): Promise<string> {
    const filePath = `${userId}/${fileName}`;
    return this.storageRepository.getFileUrl(this.AVATARS_BUCKET, filePath);
  }

  /**
   * Elimina un avatar de un usuario
   */
  async deleteAvatar(userId: string, fileName: string): Promise<boolean> {
    // Verificar que el usuario existe
    const profile = await this.profileService.findById(userId);
    
    const filePath = `${userId}/${fileName}`;
    const deleted = await this.storageRepository.deleteFile(this.AVATARS_BUCKET, filePath);
    
    // Si se eliminó correctamente, actualizar el perfil con avatar = null
    if (deleted) {
      await this.profileService.update(userId, { avatar: undefined });
    }
    
    return deleted;
  }
}