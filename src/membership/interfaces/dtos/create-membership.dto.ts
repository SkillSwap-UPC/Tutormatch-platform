import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID del usuario' })
  @IsString()
  user_id: string;

  @ApiProperty({ example: 'BASIC', enum: ['BASIC', 'STANDARD', 'PREMIUM'] })
  @IsEnum(['BASIC', 'STANDARD', 'PREMIUM'])
  type: 'BASIC' | 'STANDARD' | 'PREMIUM';

  @ApiProperty({ example: 'pending', enum: ['pending', 'active', 'rejected'] })
  @IsEnum(['pending', 'active', 'rejected'])
  status: 'pending' | 'active' | 'rejected';

  @ApiProperty({ example: 'https://url.com/proof.png', required: false })
  @IsOptional()
  @IsString()
  payment_proof?: string;
}
