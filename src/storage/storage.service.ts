import { Injectable, Inject } from '@nestjs/common';
import { StorageRepository } from './domain/repositories/storage-repository.interface';
import { STORAGE_REPOSITORY } from './constants/storage.constants';
import { StorageFile } from './domain/models/storage-file.model';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_REPOSITORY)
    private readonly storageRepository: StorageRepository,
  ) {}

  /**
   * Crea un nuevo bucket
   */
  async createBucket(bucketName: string, isPublic: boolean = false): Promise<void> {
    return this.storageRepository.createBucket(bucketName, isPublic);
  }

  /**
   * Sube un archivo a un bucket
   */
  async uploadFile(
    bucketName: string, 
    filePath: string, 
    file: Buffer, 
    contentType: string
  ): Promise<StorageFile> {
    return this.storageRepository.uploadFile(bucketName, filePath, file, contentType);
  }

  /**
   * Obtiene la URL pública de un archivo
   */
  async getFileUrl(bucketName: string, filePath: string): Promise<string> {
    return this.storageRepository.getFileUrl(bucketName, filePath);
  }

  /**
   * Elimina un archivo
   */
  async deleteFile(bucketName: string, filePath: string): Promise<boolean> {
    return this.storageRepository.deleteFile(bucketName, filePath);
  }
}