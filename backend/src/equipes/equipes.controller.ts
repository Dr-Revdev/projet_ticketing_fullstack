import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipes')
export class EquipesController {
  constructor(private readonly equipesService: EquipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'manager')
  create(@Body() createEquipeDto: CreateEquipeDto) {
    return this.equipesService.create(createEquipeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.equipesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id_equipe: string) {
    return this.equipesService.findOne(id_equipe);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'manager')
  update(
    @Param('id') id_equipe: string,
    @Body() updateEquipeDto: UpdateEquipeDto,
  ) {
    return this.equipesService.update(id_equipe, updateEquipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'manager')
  remove(@Param('id') id_equipe: string) {
    return this.equipesService.remove(id_equipe);
  }
}
