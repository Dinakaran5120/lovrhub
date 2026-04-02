import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the user requesting a new OTP',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;
}
