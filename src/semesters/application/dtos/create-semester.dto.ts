
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSemesterDto {
  @ApiProperty({
    description: 'Name of the semester',
    example: 'Fall 2025'
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
