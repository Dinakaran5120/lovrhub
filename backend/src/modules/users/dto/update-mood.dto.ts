import { IsEnum, IsOptional } from 'class-validator';
import { MoodType } from '@prisma/client';

export class UpdateMoodDto {
  @IsOptional()
  @IsEnum(MoodType)
  mood?: MoodType | null;
}
