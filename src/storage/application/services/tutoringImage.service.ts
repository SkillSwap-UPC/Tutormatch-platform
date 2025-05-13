import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { StorageRepository } from '../../domain/repositories/storage-repository.interface';
import { StorageFile } from '../../domain/models/storage-file.model';
import { STORAGE_REPOSITORY } from '../../constants/storage.constants';
import * as path from 'path';
import * as crypto from 'crypto';
import { TutoringSessionService } from 'src/tutoring/application/services/tutoring-session.service';

@Injectable()
export class TutoringImageService {
  private readonly TUTORING_IMAGE_BUCKET = 'tutoring-images';
  
  constructor(
    @Inject(STORAGE_REPOSITORY)
    private readonly storageRepository: StorageRepository,
    private readonly tutoringSessionService: TutoringSessionService,
  ) {
    // Inicializar el bucket de avatares (público para que sean accesibles)
    this.initAvatarBucket();
  }

  private async initAvatarBucket(): Promise<void> {
    await this.storageRepository.createBucket(this.TUTORING_IMAGE_BUCKET, true);
  }

  /**
   * Genera un nombre único para el archivo de avatar
   */
  private generateUniqueFileName(tutoringId: string, originalFileName: string): string {
    const fileExt = path.extname(originalFileName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Formato de archivo no permitido. Use: jpg, jpeg, png, gif, webp');
    }
    
    // Generar nombre único: userId + timestamp + hash aleatorio + extensión
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${tutoringId}-${timestamp}-${randomHash}${fileExt}`;
  }

  /**
   * Sube un avatar para un usuario y actualiza su perfil
   */
  async uploadTutoringImage(
    tutoringId: string,
    file: Express.Multer.File,
    customFileName?: string
  ): Promise<StorageFile> {
    // Verificar que el usuario existe
    const tutoring = await this.tutoringSessionService.findById(tutoringId);
    
    // Generar nombre único para el archivo o usar el personalizado
    const fileName = customFileName || this.generateUniqueFileName(tutoringId, file.originalname);
    const filePath = `${tutoringId}/${fileName}`;
    
    // Subir archivo al bucket
    const storageFile = await this.storageRepository.uploadFile(
      this.TUTORING_IMAGE_BUCKET,
      filePath,
      file.buffer,
      file.mimetype
    );
    
    // Actualizar perfil del usuario con la URL del avatar
    await this.tutoringSessionService.update(tutoringId, {
      imageUrl: storageFile.url
    });
    
    return storageFile;
  }

  /**
   * Obtiene la URL del avatar de un usuario
   */
  async getTutoringImageUrl(tutoringId: string, fileName: string): Promise<string> {
    const filePath = `${tutoringId}/${fileName}`;
    return this.storageRepository.getFileUrl(this.TUTORING_IMAGE_BUCKET, filePath);
  }

  /**
   * Elimina un avatar de un usuario
   */
  async deleteTutoringImage(tutoringId: string, fileName: string): Promise<boolean> {
    // Verificar que el usuario existe
    const tutoringSession = await this.tutoringSessionService.findById(tutoringId);
    
    const filePath = `${tutoringId}/${fileName}`;
    const deleted = await this.storageRepository.deleteFile(this.TUTORING_IMAGE_BUCKET, filePath);
    
    // Si se eliminó correctamente, actualizar el perfil con avatar = null
    if (deleted) {
      await this.tutoringSessionService.update(tutoringId, { imageUrl: undefined });
    }
    
    return deleted;
  }
}