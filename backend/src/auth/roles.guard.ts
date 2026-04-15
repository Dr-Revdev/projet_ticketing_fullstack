import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UtilisateursRolesRepository } from "../utilisateurs-roles/utilisateurs-roles.repository";
import { ROLES_KEY } from "./roles.decorator";
import { ROLE_LEVEL, isCanonicalRole, maxRoleLevel } from './roles.utils';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userRolesRepo: UtilisateursRolesRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];

        if (required.length === 0) return true;

        const req = context.switchToHttp().getRequest();
        const userId = req.user?.userId;
        if (!userId) throw new ForbiddenException('Non authentifié');

        const links = await this.userRolesRepo.listForUser(userId);
        const roleIds = links.map((x) => x.roles.libelle);

        const userLevel = maxRoleLevel(roleIds);

        const ok = required.some((r) => {
            if (isCanonicalRole(r)) {
                return userLevel >= ROLE_LEVEL[r];
            }
            return roleIds.includes(r);
        });
        if (!ok) throw new ForbiddenException('Rôle insuffisant');

        return true;
    }
}