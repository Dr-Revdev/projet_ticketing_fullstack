let onUnauthorized: (() => void) | null = null

export function setUnauthorizedCallback(cb: () => void) {
    onUnauthorized = cb
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('access_token')
    const url = `${import.meta.env.VITE_API_URL}${path}`

    const headers: HeadersInit = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    }

    const reponse = await fetch(url, { ...options, headers })

    if (reponse.status === 401) {
        if (token) {
            onUnauthorized?.()
            throw new Error('Session expirée')
        }
        throw new Error('Email ou mot de passe incorrects')

    }
    

    if (!reponse.ok) {
        const err = await reponse.json().catch(() => ({}))
        throw new Error(err.message ?? `Erreur ${reponse.status}`)
    }

    if (reponse.status === 204) return undefined as T
    const text = await reponse.text()
    if (!text) return undefined as T
    return JSON.parse(text) as T
}