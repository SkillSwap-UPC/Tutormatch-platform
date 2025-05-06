
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'First name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: ['male', 'female', 'other'] })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Role', enum: ['student', 'tutor', 'admin'] })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ description: 'Current semester number' })
  @IsNumber()
  @IsOptional()
  semesterNumber?: number;

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
