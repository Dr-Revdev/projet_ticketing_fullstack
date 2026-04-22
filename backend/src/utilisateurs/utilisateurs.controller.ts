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
import { UtilisateursService } from './utilisateurs.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateursService.create(createUtilisateurDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'manager')
  findAll(@Query('role') role?: string) {
    return this.utilisateursService.findAll(role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  findOne(@Param('id') id_utilisateur: string) {
    return this.utilisateursService.findOne(id_utilisateur);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  update(
    @Req() req: Request & { user: { userId: string } },
    @Param('id') id_utilisateur: string,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateursService.update(
      req.user.userId,
      id_utilisateur,
      updateUtilisateurDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  remove(@Param('id') id_utilisateur: string) {
    return this.utilisateursService.remove(id_utilisateur);
  }
}
