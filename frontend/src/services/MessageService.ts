const API_URL = import.meta.env.VITE_API_URL

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
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/messages?id_ticket=${idTicket}`, {
        headers: { Authorization: `Bearer ${token}`}
    })

    if (!reponse.ok) throw new Error('Impossible de récupérer les messages')
    return reponse.json()
}

export async function createMessage(data:{
    contenu: string
    visibilite: string
    id_utilisateur: string
    id_ticket: string
}): Promise<Message> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!reponse.ok) throw new Error("Impossible d'envoyer le message")
    return reponse.json()
}