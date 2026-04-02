import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { MoodType, PostVisibility } from '@prisma/client';

export class UpdatePostDto {
  @IsString()
  @MaxLength(2200)
  @IsOptional()
  caption?: string;

  @IsEnum(MoodType)
  @IsOptional()
  mood?: MoodType;

  @IsEnum(PostVisibility)
  @IsOptional()
  visibility?: PostVisibility;
}
