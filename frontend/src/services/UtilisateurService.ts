const API_URL = import.meta.env.VITE_API_URL

// Services pour Utilisateurs

export type Utilisateur = {
    id_utilisateur: string
    nom: string
    prenom: string
    email: string
    id_equipe: string
    utilisateurs_roles: { roles: { id_role: string, libelle: string } }[]
}

export async function fetchUtilisateurs(): Promise<Utilisateur[]> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/utilisateurs`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!reponse.ok) throw new Error('Impossible de récupérer les utilisateurs')
    return reponse.json()
}

export async function createUtilisateur(data: {
    nom: string
    prenom: string
    email: string
    password: string
    id_equipe: string
}): Promise<Utilisateur> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/utilisateurs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? "Impossible de créer l'utilisateur")
    }
    return reponse.json()
}

export async function updateUtilisateur(id: string, data: Partial<Utilisateur>): Promise<Utilisateur> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/utilisateurs/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? "Impossible de modifier l'utilisateur")
    }
    return reponse.json()
}

export async function deleteUtilisateur(id: string): Promise<void> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/utilisateurs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? "Impossible de supprimer l'utilisateur")
    }
}

// Service pour Rôles

export type Role = {
    id_role: string
    libelle: string
}

export async function fetchRoles(): Promise<Role[]> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!reponse.ok) throw new Error("Impossible de récupérer les rôles")
    return reponse.json()
}

export async function assignRole(idUtilisateur: string, idRole: string): Promise<void> {
    const token = localStorage.getItem('access_token')

    const reponse = await fetch(`${API_URL}/utilisateurs/${idUtilisateur}/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_role: idRole }),
    })

    if (!reponse.ok) {
        const err = await reponse.json()
        throw new Error(err.message ?? "Impossible d'assigner le rôle")
    }
}