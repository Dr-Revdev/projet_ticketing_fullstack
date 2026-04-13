import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: { userId: string } },
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketsService.createForUser(req.user.userId, createTicketDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: Request & { user: { userId: string } },
    @Query('etat') etat?: string,
    @Query('id_categorie') id_categorie?: string,
    @Query('titre') titre?: string,
  ) {
    return this.ticketsService.findAllForUser(req.user.userId, { etat, id_categorie, titre });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id_ticket: string,
  ) {
    return this.ticketsService.findOneForUser(req.user.userId, id_ticket);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id_ticket: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketsService.updateForUser(
      req.user.userId,
      id_ticket,
      updateTicketDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id_ticket: string,
  ) {
    return this.ticketsService.removeForUser(req.user.userId, id_ticket);
  }
}
