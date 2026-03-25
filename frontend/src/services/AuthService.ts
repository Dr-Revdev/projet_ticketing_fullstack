// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL

// Type du profil utilisateur
export type UserProfile = {
    id_utilisateur: string
    nom: string
    prenom: string
    email: string
    id_equipe: string
}

// Fonction d'appel de l'API (retourne un JSON)
export async function fetchMe(token: string): Promise<UserProfile> {
    const reponse = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}`}
    })

    if (!reponse.ok) {
        throw new Error('Impossible de récupérer le profil')
    }

    return reponse.json()
}

export async function changePassword(resetToken: string, newPassword: string): Promise<{ access_token: string }> {
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