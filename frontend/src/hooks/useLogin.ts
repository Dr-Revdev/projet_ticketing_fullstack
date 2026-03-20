import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { login } from "../services/LoginService";

export function useLogin() {
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (email: string, password: string) => {
        setError(null)

        try {
            const result = await login(email, password)

            if ('must_change_password' in result) {
                // Stockage temporaire du token de reset, puis redirection
                sessionStorage.setItem('reset_token', result.reset_token)
                navigate('/change-password')
            } else {
                // Stockege du tocken d'accès, puis redirection vers l'accueil
                localStorage.setItem('access_token', result.access_token)
                navigate('/')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de connexion')
        }
    }

    return { handleLogin, error }
}