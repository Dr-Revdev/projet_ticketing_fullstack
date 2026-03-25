import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { changePassword } from "../services/AuthService";

export default function useChangePassword() {
    const navigate = useNavigate()
    const { login: authLogin } = useAuth()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        const resetToken = sessionStorage.getItem('reset_token')
        if (!resetToken) {
            setError('Token de réinitialisation manquant')
            return
        }

        try {
            const data = await changePassword(resetToken, newPassword)
            sessionStorage.removeItem('reset_token')
            await authLogin(data.access_token)
            navigate('/dashboard') 
        } catch (err: any) {
            setError(err.message)
        }
    }

    return { newPassword, setNewPassword, confirmPassword, setConfirmPassword, error, handleSubmit }
}