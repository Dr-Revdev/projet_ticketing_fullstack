import { apiClient } from "./apiClient"

// Type du profil utilisateur
export type UserProfile = {
    id_utilisateur: string
    nom: string
    prenom: string
    email: string
    id_equipe: string
    equipes: {
        nom: string
    }
    utilisateurs_roles: {
        roles: {
            id_role: string
            libelle: string
        }
    }[]
}

// Fonction d'appel de l'API (retourne un JSON)
export async function fetchMe(): Promise<UserProfile> {
    return apiClient<UserProfile>('/auth/me')
}

export async function changePassword(resetToken: string, newPassword: string): Promise<{ access_token: string }> {
    const API_URL = import.meta.env.VITE_API_URL
    const reponse = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resetToken}`, 
        },
        body: JSON.stringify({ newPassword }),
    })

    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? 'Erreur lors du chargement de mot de passe')
    }
    
    return reponse.json()
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient<void>('/auth/me/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
    })
}