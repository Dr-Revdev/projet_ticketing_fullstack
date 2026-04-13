import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilisateursModule } from '../utilisateurs/utilisateurs.module';
import type { StringValue } from 'ms';
import { JwtStrategy } from './jwt.strategy';
import { JwtResetStrategy } from './jwt-reset.strategy';
import { UtilisateursRolesModule } from '../utilisateurs-roles/utilisateurs-roles.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UtilisateursModule,
    PassportModule,
    UtilisateursRolesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET manquant');

        const expiresIn = (config.get<string>('JWT_EXPIRES_IN') ?? '8h') as StringValue;
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtResetStrategy, RolesGuard],
})
export class AuthModule {}
