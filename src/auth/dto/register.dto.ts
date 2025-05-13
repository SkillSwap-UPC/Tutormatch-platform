
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsIn, IsNumber } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female', 'other'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({ description: 'Semester number' })
  @IsNumber()
  @IsNotEmpty()
  semesterNumber: number;

  @ApiProperty({ description: 'Role', enum: ['student', 'tutor', 'admin'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['student', 'tutor', 'admin'])
  role: string;
}
