import { apiClient } from "./apiClient"

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
    archived_at: string | null
    categories: { libelle: string }
}

// Type pour les catégorie
export type Categorie = {
    id_categorie: string
    libelle: string
}

// Fonction d'appel de l'API (retourne un JSON)
export async function fetchTickets(filters: { etat?: string, id_categorie?: string, titre?: string } = {}): Promise<Ticket[]> {
    const params = new URLSearchParams()
    if (filters.etat) params.append('etat', filters.etat)
    if (filters.id_categorie) params.append('id_categorie', filters.id_categorie)
    if (filters.titre) params.append('titre', filters.titre)
    const query = params.toString() ? `?${params.toString()}` : ''
    
    return apiClient<Ticket[]>(`/tickets${query}`)
}

export async function fetchTicket(id: string): Promise<Ticket> {
    return apiClient<Ticket>(`/tickets/${id}`)
}

// Récupération des catégories
export async function fetchCategories(): Promise<Categorie[]> {
    return apiClient<Categorie[]>('/categories')
}

// Création de ticket
export async function createTicket(ticket: {
    titre: string
    etat: string
    id_categorie: string
}): Promise<Ticket> {
    return apiClient<Ticket>('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticket)
    })
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
    return apiClient(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}