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
import { UtilisateursService } from './utilisateurs.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) { }

  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateursService.create(createUtilisateurDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.utilisateursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id_utilisateur: string) {
    return this.utilisateursService.findOne(id_utilisateur);
  }

  @Patch(':id')
  update(
    @Param('id') id_utilisateur: string,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateursService.update(
      id_utilisateur,
      updateUtilisateurDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id_utilisateur: string) {
    return this.utilisateursService.remove(id_utilisateur);
  }
}
