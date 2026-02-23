import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoriqueActionsService } from './historique-actions.service';
import { CreateHistoriqueActionDto } from './dto/create-historique-action.dto';

@Controller('historique-actions')
export class HistoriqueActionsController {
  constructor(private readonly historiqueActionsService: HistoriqueActionsService) {}

  @Post()
  create(@Body() createHistoriqueActionDto: CreateHistoriqueActionDto) {
    return this.historiqueActionsService.create(createHistoriqueActionDto);
  }

  @Get()
  findAll() {
    return this.historiqueActionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_action: string) {
    return this.historiqueActionsService.findOne(id_action);
  }
}
