type UserRole = { roles: { libelle: string } }

const ROLE_LEVEL: Record<string, number> = {
    user: 0, agent: 1, manager: 2, admin: 3
}

export function getRoleLevel(utilisateurs_roles: UserRole[]): number {
    return Math.max(0, ...utilisateurs_roles.map(ur => ROLE_LEVEL[ur.roles.libelle]))
}

export function hasAtLeast(utilisateurs_roles: UserRole[], minRole: string): boolean {
    return getRoleLevel(utilisateurs_roles) >= (ROLE_LEVEL[minRole] ?? 0)
}

export function getHighestRole(utilisateurs_roles: UserRole[]): string {
    const level = getRoleLevel(utilisateurs_roles)
    return Object.entries(ROLE_LEVEL).find(([, v]) => v === level)?.[0] ?? 'user'
}