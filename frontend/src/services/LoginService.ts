// Service pour la connexion API Login

// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL;

// Types pour les retours de l'API
export type LoginSuccessResponse = {
    access_token: string;
};

export type LoginResetResponse = {
    must_change_password: true;
    reset_token: string;
};

export type LoginResponse = LoginSuccessResponse | LoginResetResponse;

// Fonction d'appel de l'API (retourne un JSON)
export async function login(email: string, password: string): Promise<LoginResponse> {
    const reponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!reponse.ok) {
        const error = await reponse.json();
        throw new Error(error.message ?? 'Erreur de connexion');
    }

    return reponse.json();
}