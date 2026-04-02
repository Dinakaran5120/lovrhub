import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { MessageType } from '@prisma/client';

export class SendMessageDto {
  @ValidateIf((o: SendMessageDto) => o.messageType === MessageType.text || !o.messageType)
  @IsString()
  @MaxLength(500)
  content?: string;

  @IsEnum(MessageType)
  @IsOptional()
  messageType: MessageType = MessageType.text;

  @ValidateIf(
    (o: SendMessageDto) =>
      o.messageType !== undefined && o.messageType !== MessageType.text,
  )
  @IsUUID()
  mediaId?: string;

  @IsUUID()
  @IsOptional()
  replyToId?: string;
}
