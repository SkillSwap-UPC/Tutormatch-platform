import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ 
    description: 'ID del usuario al que pertenece el avatar',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    description: 'Nombre personalizado para el archivo (opcional)',
    required: false
  })
  @IsString()
  @IsOptional()
  fileName?: string;
}