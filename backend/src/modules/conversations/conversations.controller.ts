import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AccountActiveGuard } from '@/common/guards/account-active.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/decorators/current-user.decorator';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard, AccountActiveGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get()
  getConversations(
    @CurrentUser() user: JwtPayload,
    @Query() dto: GetConversationsDto,
  ) {
    return this.conversationsService.getConversations(user.sub, dto);
  }

  @Get(':id')
  getConversationById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.conversationsService.getConversationById(id, user.sub);
  }

  @Get(':id/messages')
  getMessages(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() dto: GetMessagesDto,
  ) {
    return this.messagesService.getMessages(id, user.sub, dto);
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  sendMessage(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(id, user.sub, dto);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  markConversationRead(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.messagesService.markConversationRead(id, user.sub);
  }

  @Delete(':id/messages/:messageId')
  @HttpCode(HttpStatus.OK)
  deleteMessage(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) _id: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messagesService.deleteMessage(messageId, user.sub);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveConversation(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.conversationsService.archiveConversation(id, user.sub);
  }

  @Patch(':id/unarchive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unarchiveConversation(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.conversationsService.unarchiveConversation(id, user.sub);
  }
}
