import { StorageFile } from '../models/storage-file.model';

export interface StorageRepository {
  /**
   * Crea un bucket si no existe
   * @param bucketName Nombre del bucket a crear
   * @param isPublic Si el bucket es público o privado
   */
  createBucket(bucketName: string, isPublic: boolean): Promise<void>;
  
  /**
   * Sube un archivo al bucket
   * @param bucketName Nombre del bucket
   * @param filePath Ruta donde se guardará el archivo
   * @param file Buffer del archivo
   * @param contentType Tipo de contenido del archivo
   */
  uploadFile(
    bucketName: string,
    filePath: string,
    file: Buffer,
    contentType: string
  ): Promise<StorageFile>;
  
  /**
   * Obtiene la URL pública de un archivo
   * @param bucketName Nombre del bucket
   * @param filePath Ruta del archivo
   */
  getFileUrl(bucketName: string, filePath: string): Promise<string>;
  
  /**
   * Elimina un archivo del bucket
   * @param bucketName Nombre del bucket
   * @param filePath Ruta del archivo
   */
  deleteFile(bucketName: string, filePath: string): Promise<boolean>;
}