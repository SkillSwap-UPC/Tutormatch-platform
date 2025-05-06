
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ description: 'Profile UUID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female', 'other'] })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ description: 'Role', enum: ['student', 'tutor', 'admin'] })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ description: 'Current semester number' })
  @IsNumber()
  @IsNotEmpty()
  semesterNumber: number;

  @ApiPropertyOptional({ description: 'Academic year' })
  @IsString()
  @IsOptional()
  academicYear?: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Biography' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Profile status', enum: ['active', 'inactive', 'pending'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Tutor ID (if applicable)' })
  @IsUUID()
  @IsOptional()
  tutorId?: string;
}
