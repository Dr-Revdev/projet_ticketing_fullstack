import { Module } from '@nestjs/common';
import { PieceJointesService } from './piece-jointes.service';
import { PieceJointesController } from './piece-jointes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PieceJointeRepository } from './piece-jointes.repository';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [PrismaModule, AccessModule],
  controllers: [PieceJointesController],
  providers: [PieceJointesService, PieceJointeRepository],
})
export class PieceJointesModule {}
