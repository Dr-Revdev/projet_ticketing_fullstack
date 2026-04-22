import { apiClient } from "./apiClient"



export type PieceJointe = {
    id_piece_jointe: string
    nom_fichier: string
    url_path: string
    id_ticket: string
}

export async function fetchPieceJointes(id_ticket: string):Promise<PieceJointe[]> {
    return apiClient<PieceJointe[]>(`/piece-jointes/${id_ticket}`)
}

export async function uploadPieceJointe(id_ticket: string, file: File): Promise<PieceJointe> {
    const API_URL = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('access_token')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('id_ticket', id_ticket)
    const reponse = await fetch(`${API_URL}/piece-jointes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    })
    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? "Erreur lors de l'upload")
    }
    return reponse.json()
}