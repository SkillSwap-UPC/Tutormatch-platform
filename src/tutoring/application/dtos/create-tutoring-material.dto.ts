
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutoringMaterialDto {
  @ApiProperty({
    description: 'ID of the tutoring session',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  tutoringId: string;

  @ApiProperty({
    description: 'Title of the material',
    example: 'JavaScript Basics Slides'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the material (optional)',
    example: 'Slides covering the basics of JavaScript',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of material',
    example: 'document',
    enum: ['document', 'video', 'link', 'image', 'code']
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['document', 'video', 'link', 'image', 'code'])
  type: 'document' | 'video' | 'link' | 'image' | 'code';

  @ApiProperty({
    description: 'URL to the material',
    example: 'https://example.com/materials/javascript-basics.pdf'
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Size of the material in bytes (optional)',
    example: 1048576,
    minimum: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  size?: number;

  @ApiProperty({
    description: 'ID of the user who uploaded the material',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsNotEmpty()
  @IsUUID()
  uploadedBy: string;
}
