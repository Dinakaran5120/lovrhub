import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { MoodType, PostVisibility } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  @MaxLength(2200)
  @IsOptional()
  caption?: string;

  @IsEnum(MoodType)
  @IsOptional()
  mood?: MoodType;

  @IsEnum(PostVisibility)
  @IsOptional()
  visibility: PostVisibility = PostVisibility.public;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  mediaIds: string[];
}
