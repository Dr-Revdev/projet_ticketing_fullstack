import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AccessService } from 'src/access/access.service';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor(private readonly access: AccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId: string | undefined = req.user?.userId;
    if (!userId) throw new ForbiddenException('Non authentifié');

    const paramId: string | undefined = req.params?.id ?? req.params?.id_utilisateur;
    if (!paramId) return false;

    if (paramId === userId) return true;

    const ctx = await this.access.getUserContext(userId);
    if (this.access.isAdmin(ctx)) return true;

    throw new ForbiddenException('Accès interdit');
  }
}
