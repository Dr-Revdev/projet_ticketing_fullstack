const API_URL = import.meta.env.VITE_API_URL

export type Equipe = {
    id_equipe: string
    nom: string
}

export async function fetchEquipes(): Promise<Equipe[]> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/equipes`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!reponse.ok) throw new Error('Impossible de récupérer les équipes')
    return reponse.json()
}