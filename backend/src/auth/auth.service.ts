import * as bcrypt from 'bcrypt'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UtilisateurRepository } from 'src/utilisateurs/utilisateurs.repository';


@Injectable()
export class AuthService {
  constructor(private readonly repo: UtilisateurRepository) {}

  async login(email: string, password: string) {
    const user = await this.repo.findAuthByEmail(email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Identifiants invalides');

    return { ok: true }
  }
}
