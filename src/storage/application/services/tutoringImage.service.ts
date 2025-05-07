import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { StorageRepository } from '../../domain/repositories/storage-repository.interface';
import { StorageFile } from '../../domain/models/storage-file.model';
import { STORAGE_REPOSITORY } from '../../constants/storage.constants';
import { TutoringSessionService } from '../../../tutoring/application/services/tutoring-session.service';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class TutoringImageService {
  private readonly TUTORING_IMAGES_BUCKET = 'tutoring-images';
  
  constructor(
    @Inject(STORAGE_REPOSITORY)
    private readonly storageRepository: StorageRepository,
    private readonly tutoringSessionService: TutoringSessionService,
  ) {
    // Inicializar el bucket de imágenes de tutorías (público para que sean accesibles)
    this.initTutoringImagesBucket();
  }

  private async initTutoringImagesBucket(): Promise<void> {
    await this.storageRepository.createBucket(this.TUTORING_IMAGES_BUCKET, true);
  }

  /**
   * Genera un nombre único para el archivo de imagen de tutoría
   */
  private generateUniqueFileName(tutoringId: string, originalFileName: string): string {
    const fileExt = path.extname(originalFileName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Formato de archivo no permitido. Use: jpg, jpeg, png, gif, webp');
    }
    
    // Generar nombre único: tutoringId + timestamp + hash aleatorio + extensión
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${tutoringId}-${timestamp}-${randomHash}${fileExt}`;
  }

  /**
   * Sube una imagen para una sesión de tutoría y actualiza su registro
   */
  async uploadTutoringImage(
    tutoringId: string,
    file: Express.Multer.File,
    customFileName?: string
  ): Promise<StorageFile> {
    // Verificar que la sesión de tutoría existe
    const session = await this.tutoringSessionService.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Sesión de tutoría con ID ${tutoringId} no encontrada`);
    }
    
    // Generar nombre único para el archivo o usar el personalizado
    const fileName = customFileName || this.generateUniqueFileName(tutoringId, file.originalname);
    const filePath = `${tutoringId}/${fileName}`;
    
    // Subir archivo al bucket
    const storageFile = await this.storageRepository.uploadFile(
      this.TUTORING_IMAGES_BUCKET,
      filePath,
      file.buffer,
      file.mimetype
    );
    
    // Actualizar la sesión de tutoría con la URL de la imagen
    await this.tutoringSessionService.update(tutoringId, {
      imageUrl: storageFile.url
    });
    
    return storageFile;
  }

  /**
   * Obtiene la URL de la imagen de una tutoría
   */
  async getTutoringImageUrl(tutoringId: string, fileName: string): Promise<string> {
    const filePath = `${tutoringId}/${fileName}`;
    return this.storageRepository.getFileUrl(this.TUTORING_IMAGES_BUCKET, filePath);
  }

  /**
   * Elimina una imagen de una tutoría
   */
  async deleteTutoringImage(tutoringId: string, fileName: string): Promise<boolean> {
    // Verificar que la sesión de tutoría existe
    const session = await this.tutoringSessionService.findById(tutoringId);
    if (!session) {
      throw new NotFoundException(`Sesión de tutoría con ID ${tutoringId} no encontrada`);
    }
    
    const filePath = `${tutoringId}/${fileName}`;
    const deleted = await this.storageRepository.deleteFile(this.TUTORING_IMAGES_BUCKET, filePath);
    
    // Si se eliminó correctamente, actualizar la sesión con imageUrl = null
    if (deleted) {
      await this.tutoringSessionService.update(tutoringId, { imageUrl: undefined });
    }
    
    return deleted;
  }
}