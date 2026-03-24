import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from 'express';
// import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: { userId: string } },
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.createForUser(req.user.userId, createMessageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: Request & { user: { userId: string } },
    @Query('id_ticket') id_ticket?: string,
  ) {
    return this.messagesService.findAllForUser(req.user.userId, id_ticket);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id_message: string,
  ) {
    return this.messagesService.findOneForUser(req.user.userId, id_message);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  remove(@Param('id') id_message: string) {
    return this.messagesService.remove(id_message);
  }
}
