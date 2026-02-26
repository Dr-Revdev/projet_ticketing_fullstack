import * as bcrypt from 'bcrypt'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UtilisateurRepository } from 'src/utilisateurs/utilisateurs.repository';
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

    const access_token = await this.jwt.signAsync({
      sub: user.id_utilisateur,
    })

    return { access_token }
  }
}
