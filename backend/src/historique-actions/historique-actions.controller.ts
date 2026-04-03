import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HistoriqueActionsService } from './historique-actions.service';
import { CreateHistoriqueActionDto } from './dto/create-historique-action.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('historique-actions')
@UseGuards(JwtAuthGuard)
@Roles('admin', 'manager', 'agent')
export class HistoriqueActionsController {
  constructor(
    private readonly historiqueActionsService: HistoriqueActionsService,
  ) { }

  @Post()
  @Roles('admin')
  create(@Body() createHistoriqueActionDto: CreateHistoriqueActionDto) {
    return this.historiqueActionsService.create(createHistoriqueActionDto);
  }

  @Get()
  findAll() {
    return this.historiqueActionsService.findAll();
  }

  @Get('ticket/:id_ticket')
  findByTicket(@Param('id_ticket') id_ticket: string) {
    return this.historiqueActionsService.findByTicket(id_ticket);
  }

  @Get(':id')
  findOne(@Param('id') id_action: string) {
    return this.historiqueActionsService.findOne(id_action);
  }
}
