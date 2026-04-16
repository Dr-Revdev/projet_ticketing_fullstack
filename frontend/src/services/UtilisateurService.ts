import { apiClient } from "./apiClient"

// Services pour Utilisateurs

export type Utilisateur = {
    id_utilisateur: string
    nom: string
    prenom: string
    email: string
    id_equipe: string
    utilisateurs_roles: { roles: { id_role: string, libelle: string } }[]
    equipes: { nom: string }
}

export async function fetchUtilisateurs(role?: string): Promise<Utilisateur[]> {
    const query = role ? `?role=${encodeURIComponent(role)}` : ''
    return apiClient<Utilisateur[]>(`/utilisateurs${query}`)
}

export async function createUtilisateur(data: {
    nom: string
    prenom: string
    email: string
    password: string
    id_equipe: string
}): Promise<Utilisateur> {
    return apiClient<Utilisateur>(`/utilisateurs`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateUtilisateur(id: string, data: Partial<Utilisateur>): Promise<Utilisateur> {
    return apiClient<Utilisateur>(`/utilisateurs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}

export async function deleteUtilisateur(id: string): Promise<void> {
    return apiClient<void>(`/utilisateurs/${id}`, {
        method: 'DELETE',
    })
}

// Service pour Rôles

export type Role = {
    id_role: string
    libelle: string
}

export async function fetchRoles(): Promise<Role[]> {
    return apiClient<Role[]>('/roles')
}

export async function assignRole(idUtilisateur: string, idRole: string): Promise<void> {
    return apiClient<void>(`/utilisateurs/${idUtilisateur}/roles`, {
        method: 'POST',
        body: JSON.stringify({ id_role: idRole }),
    })
}