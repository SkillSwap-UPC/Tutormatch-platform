import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UploadPaymentProofDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del usuario' })
  @IsString()
  user_id: string;

  @ApiProperty({ example: 'comprobante.jpg', required: false })
  @IsOptional()
  @IsString()
  file_name?: string;
}
