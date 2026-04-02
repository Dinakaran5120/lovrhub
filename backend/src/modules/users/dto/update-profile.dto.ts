import {
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  IsOptional,
  ValidateEach,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  GenderType,
  OrientationType,
  RelationshipGoal,
  InterestedInType,
  VisibilityType,
} from '@prisma/client';

export class ProfileStepBasicDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName: string;

  @IsDateString()
  birthDate: string;
}

export class ProfileStepGenderDto {
  @IsEnum(GenderType)
  gender: GenderType;
}

export class ProfileStepOrientationDto {
  @IsEnum(OrientationType)
  orientation: OrientationType;
}

export class ProfileStepInterestedInDto {
  @IsArray()
  @IsEnum(InterestedInType, { each: true })
  interestedIn: InterestedInType[];
}

export class ProfileStepRelationshipDto {
  @IsEnum(RelationshipGoal)
  relationshipGoal: RelationshipGoal;
}

export class ProfileStepLanguagesDto {
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  languages: string[];
}

export class ProfileStepInterestsDto {
  @IsArray()
  @ArrayMaxSize(15)
  @IsString({ each: true })
  interests: string[];
}

export class UpdateBioDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}

export class UpdateVisibilityDto {
  @IsEnum(VisibilityType)
  visibility: VisibilityType;
}
