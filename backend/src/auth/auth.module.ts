import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilisateursModule } from 'src/utilisateurs/utilisateurs.module';

@Module({
  imports: [UtilisateursModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
