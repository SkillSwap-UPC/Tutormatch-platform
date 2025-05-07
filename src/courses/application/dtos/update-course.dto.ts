
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Computer Science',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Semester number for the course',
    example: 1,
    minimum: 1,
    maximum: 12,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  semesterNumber?: number;
}
