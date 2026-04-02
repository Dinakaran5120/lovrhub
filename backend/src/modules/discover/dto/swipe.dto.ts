import { IsUUID, IsEnum } from 'class-validator';

export enum SwipeAction {
  LIKE = 'like',
  PASS = 'pass',
  SUPER_LIKE = 'super_like',
}

export class SwipeDto {
  @IsUUID()
  swipedUserId: string;

  @IsEnum(SwipeAction)
  action: SwipeAction;
}
