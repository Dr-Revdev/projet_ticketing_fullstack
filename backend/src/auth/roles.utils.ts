export type CanonicalRole = 'user' | 'agent' | 'manager' | 'admin';

export const ROLE_LEVEL: Record<CanonicalRole, number> = {
    user: 0,
    agent: 1,
    manager: 2,
    admin: 3,
};

export function isCanonicalRole(value: string): value is CanonicalRole {
    return value === 'user' || value === 'agent' || value === 'manager' || value === 'admin';
}

export function maxRoleLevel(roleIds: string[]): number {
    let max = ROLE_LEVEL.user;
    for (const roleId of roleIds) {
        if (!isCanonicalRole(roleId)) continue;
        const lvl = ROLE_LEVEL[roleId];
        if (lvl > max) max = lvl;
    }
    return max;
}