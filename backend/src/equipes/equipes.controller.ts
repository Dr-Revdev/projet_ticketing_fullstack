import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';

@Controller('equipes')
export class EquipesController {
  constructor(private readonly equipesService: EquipesService) {}

  @Post()
  create(@Body() createEquipeDto: CreateEquipeDto) {
    return this.equipesService.create(createEquipeDto);
  }

  @Get()
  findAll() {
    return this.equipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_equipe: string) {
    return this.equipesService.findOne(id_equipe);
  }

  @Patch(':id')
  update(@Param('id') id_equipe: string, @Body() updateEquipeDto: UpdateEquipeDto) {
    return this.equipesService.update(id_equipe, updateEquipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id_equipe: string) {
    return this.equipesService.remove(id_equipe);
  }
}
