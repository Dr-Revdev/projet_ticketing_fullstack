import { apiClient } from "./apiClient"

export type Message = {
    id_message: string
    contenu: string
    visibilite: string
    date_message: string
    id_utilisateur: string
    id_ticket: string
    utilisateurs: {
        id_utilisateur: string
        nom: string
        prenom: string
    }
}

export async function fetchMessages(idTicket: string): Promise<Message[]> {
    return apiClient<Message[]>(`/messages?id_ticket=${idTicket}`)
}

export async function createMessage(data:{
    contenu: string
    visibilite: string
    id_ticket: string
}): Promise<Message> {
    return apiClient<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}