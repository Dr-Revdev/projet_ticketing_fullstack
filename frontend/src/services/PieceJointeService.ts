const API_URL = import.meta.env.VITE_API_URL

export type PieceJointe = {
    id_piece_jointe: string
    nom_fichier: string
    url_path: string
    id_ticket: string
}

export async function fetchPieceJointes(id_ticket: string):Promise<PieceJointe[]> {
    const token = localStorage.getItem('access_token')
    const reponse = await fetch(`${API_URL}/piece-jointes/${id_ticket}`, {
        headers: { Authorization: `Bearer ${token}`}
    })
    if (!reponse.ok) throw new Error('Impossible de récupérer les pièces jointes')
        return reponse.json()
}

export async function uploadPieceJointe(id_ticket: string, file: File): Promise<PieceJointe> {
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