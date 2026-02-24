import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_message: string) {
    return this.messagesService.findOne(id_message);
  }

  /*  @Patch(':id')
  update(@Param('id') id_message: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id_message, updateMessageDto);
  }
*/
  @Delete(':id')
  remove(@Param('id') id_message: string) {
    return this.messagesService.remove(id_message);
  }
}
