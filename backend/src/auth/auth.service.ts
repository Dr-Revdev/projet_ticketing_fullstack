import * as bcrypt from 'bcrypt'
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UtilisateurRepository } from '../utilisateurs/utilisateurs.repository';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly repo: UtilisateurRepository,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.repo.findAuthByEmail(email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Identifiants invalides');

    await this.repo.touchDerniereConnexion(user.id_utilisateur);

    if (user.password_changed_at == null) {
      const reset_token = await this.jwt.signAsync(
        { sub: user.id_utilisateur, purpose: 'pwd_reset' },
        { expiresIn: '10m' },
      );

      return { must_change_password: true, reset_token };
    }

    const access_token = await this.jwt.signAsync({
      sub: user.id_utilisateur,
    });

    return { access_token };
  }

  async changePasswordFirstLogin(userId: string, newPassword: string) {
    const password_hash = await bcrypt.hash(newPassword, 10);

    // UPDATE CONDITIONNEL pour first login
    const update = await this.repo.setPasswordFirstLogin(userId, password_hash);

    if (!update) {
      throw new ForbiddenException('Mot de passe déjà changé ou compte invalide');
    }

    const access_token = await this.jwt.signAsync({ sub: userId });
    return { access_token };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.repo.findAuthById(userId);
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) throw new UnauthorizedException('Mot de passe actuel incorrect');

    const password_hash = await bcrypt.hash(newPassword, 10);
    await this.repo.updateById(userId, { password_hash, password_changed_at: new Date() });
  }

  async me(userId: string) {
    return this.repo.findById(userId);
  }
}
