import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_ticket: string) {
    return this.ticketsService.findOne(id_ticket);
  }

  @Patch(':id')
  update(@Param('id') id_ticket: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id_ticket, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id_ticket: string) {
    return this.ticketsService.remove(id_ticket);
  }
}
