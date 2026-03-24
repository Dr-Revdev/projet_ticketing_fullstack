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