import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { StorageRepository } from '../../domain/repositories/storage-repository.interface';
import { StorageFile } from '../../domain/models/storage-file.model';
import { STORAGE_REPOSITORY } from '../../constants/storage.constants';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class PaymentProofService {
  private readonly BUCKET = 'payment-proofs';

  constructor(
    @Inject(STORAGE_REPOSITORY)
    private readonly storageRepository: StorageRepository,
  ) {
    this.initBucket();
  }

  private async initBucket(): Promise<void> {
    await this.storageRepository.createBucket(this.BUCKET, false);
  }

  private generateUniqueFileName(userId: string, originalFileName: string): string {
    const fileExt = path.extname(originalFileName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.webp'];
    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('Formato de archivo no permitido. Use: jpg, jpeg, png, pdf, webp');
    }
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${userId}-${timestamp}-${randomHash}${fileExt}`;
  }

  async uploadPaymentProof(
    userId: string,
    file: Express.Multer.File,
    customFileName?: string
  ): Promise<StorageFile> {
    const fileName = customFileName || this.generateUniqueFileName(userId, file.originalname);
    const filePath = `${userId}/${fileName}`;
    return this.storageRepository.uploadFile(
      this.BUCKET,
      filePath,
      file.buffer,
      file.mimetype
    );
  }

  async getPaymentProofUrl(userId: string, fileName: string): Promise<string> {
    const filePath = `${userId}/${fileName}`;
    return this.storageRepository.getFileUrl(this.BUCKET, filePath);
  }

  async deletePaymentProof(userId: string, fileName: string): Promise<boolean> {
    const filePath = `${userId}/${fileName}`;
    return this.storageRepository.deleteFile(this.BUCKET, filePath);
  }
}
