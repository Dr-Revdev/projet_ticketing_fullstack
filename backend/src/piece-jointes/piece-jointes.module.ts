import { Module } from '@nestjs/common';
import { PieceJointesService } from './piece-jointes.service';
import { PieceJointesController } from './piece-jointes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PieceJointeRepository } from './piece-jointes.repository';

@Module({
  imports:[PrismaModule],
  controllers: [PieceJointesController],
  providers: [PieceJointesService, PieceJointeRepository],
})
export class PieceJointesModule {}
