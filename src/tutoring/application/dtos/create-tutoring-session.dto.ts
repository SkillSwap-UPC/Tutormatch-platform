
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsUUID, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateAvailableTimeDto } from './create-available-time.dto';

export class CreateTutoringSessionDto {
  @ApiProperty({
    description: 'ID of the tutor',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  tutorId: string;

  @ApiProperty({
    description: 'ID of the course (optional)',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiProperty({
    description: 'Title of the tutoring session',
    example: 'Introduction to JavaScript'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the tutoring session (optional)',
    example: 'Learn the basics of JavaScript programming language',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the tutoring session',
    example: 50.00,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'List of what students will learn',
    example: ['JavaScript basics', 'DOM manipulation', 'Event handling']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whatTheyWillLearn?: string[];

  @ApiProperty({
    description: 'URL to the image for the tutoring session',
    example: 'https://example.com/images/javascript.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Available time slots for the tutoring session',
    type: [CreateAvailableTimeDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvailableTimeDto)
  availableTimes?: CreateAvailableTimeDto[];
}
