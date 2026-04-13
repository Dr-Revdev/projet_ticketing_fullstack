import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UtilisateursRolesRepository } from "../utilisateurs-roles/utilisateurs-roles.repository";
import { ROLES_KEY } from "./roles.decorator";

type CanonicalRole = 'user' | 'agent' | 'manager' | 'admin';

const ROLE_LEVEL: Record<CanonicalRole, number> = {
    user: 0,
    agent: 1,
    manager: 2,
    admin: 3,
};

function isCanonicalRole(value: string): value is CanonicalRole {
    return value === 'user' || value === 'agent' || value === 'manager' || value === 'admin';
}

function maxRoleLevel(roleIds: string[]): number {
    let max = ROLE_LEVEL.user;
    for (const roleId of roleIds) {
        if (!isCanonicalRole(roleId)) continue;
        const lvl = ROLE_LEVEL[roleId];
        if (lvl > max) max = lvl;
    }
    return max;
}

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
        const roleIds = links.map((x: any) => x.roles.libelle);

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