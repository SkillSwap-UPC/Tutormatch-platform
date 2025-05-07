
import { IsNotEmpty, IsNumber, IsString, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailableTimeDto {
  @ApiProperty({
    description: 'Day of the week (0-6, Sunday to Saturday)',
    example: 1,
    minimum: 0,
    maximum: 6
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    description: 'Start time in HH:MM format',
    example: '09:00'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM format'
  })
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:MM format',
    example: '10:30'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM format'
  })
  endTime: string;
}
