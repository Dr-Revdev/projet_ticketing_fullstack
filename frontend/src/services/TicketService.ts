// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL

// Type pour les tickets
export type Ticket = {
    id_ticket: string
    titre: string
    date_creation: string
    etat: string
    resultat: string | null
    id_createur: string
    id_categorie: string
    id_agent_assigne: string | null
    achived_at: string | null
}

// Type pour les catégorie
export type Categorie = {
    id_categorie: string
    libelle: string
}

// Fonction d'appel de l'API (retourne un JSON)
export async function fetchTickets(): Promise<Ticket[]> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!reponse.ok) {
        throw new Error('Impossible de récupérer les tickets')
    }

    return reponse.json()
}

export async function fetchTicket(id: string): Promise<Ticket> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!reponse.ok) {
        throw new Error("Impossible de récupérer le ticket")
    }

    return reponse.json()
}

// Récupération des catégories
export async function fetchCategories(): Promise<Categorie[]> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!reponse.ok) {
        throw new Error('Impossible de récupérer les catégories')
    }

    return reponse.json()
}

// Création de ticket
export async function createTicket(ticket: {
    titre: string
    etat: string
    id_createur: string
    id_categorie: string
}): Promise<Ticket> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ticket)
    })

    if (!reponse.ok) {
        const error = await reponse.json()
        throw new Error(error.message ?? 'Erreur lors de la création du ticket')
    }

    return reponse.json()
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? 'Impossible de modifier le ticket')
    }
    return reponse.json()
}