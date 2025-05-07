import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadTutoringImageDto {
  @ApiProperty({ 
    description: 'ID de la sesión de tutoría a la que pertenece la imagen',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  tutoringId: string;

  @ApiProperty({ 
    description: 'Nombre personalizado para el archivo (opcional)',
    required: false
  })
  @IsString()
  @IsOptional()
  fileName?: string;
}