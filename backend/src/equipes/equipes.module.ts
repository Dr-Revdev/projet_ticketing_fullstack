import { Module } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { EquipesController } from './equipes.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EquipeRepository } from './equipes.repository';

@Module({
  imports:[PrismaModule],
  controllers: [EquipesController],
  providers: [EquipesService, EquipeRepository],
})
export class EquipesModule {}
