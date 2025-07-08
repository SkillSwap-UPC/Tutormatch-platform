import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateMembershipStatusDto {
  @ApiProperty({ example: 'active', enum: ['pending', 'active', 'rejected'] })
  @IsEnum(['pending', 'active', 'rejected'])
  status: 'pending' | 'active' | 'rejected';
}
