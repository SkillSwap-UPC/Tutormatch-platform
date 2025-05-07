
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSemesterDto {
  @ApiProperty({
    description: 'Name of the semester',
    example: 'Fall 2025',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;
}
