import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleRepository } from './roles.repository';

@Module({
  imports:[PrismaModule],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
})
export class RolesModule {}
