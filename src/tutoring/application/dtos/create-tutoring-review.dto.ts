
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutoringReviewDto {
  @ApiProperty({
    description: 'ID of the tutoring session',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  tutoringId: string;

  @ApiProperty({
    description: 'ID of the student giving the review',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Rating (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comment for the review (optional)',
    example: 'Great tutoring session, very helpful!',
    required: false
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
