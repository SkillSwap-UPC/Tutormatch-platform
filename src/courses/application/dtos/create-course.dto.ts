
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Computer Science'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Semester number for the course',
    example: 1,
    minimum: 1,
    maximum: 12
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  semesterNumber: number;
}
