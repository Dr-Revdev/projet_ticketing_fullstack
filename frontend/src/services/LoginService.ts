// Service pour la connexion API Login

import { apiClient } from "./apiClient";

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
    return apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}