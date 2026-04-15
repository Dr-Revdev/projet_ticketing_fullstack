import { apiClient } from './apiClient'

export type Equipe = {
    id_equipe: string
    nom: string
}

export async function fetchEquipes(): Promise<Equipe[]> {
    return apiClient<Equipe[]>('/equipes')
}