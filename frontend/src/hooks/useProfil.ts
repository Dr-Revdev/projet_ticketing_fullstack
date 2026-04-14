import { useState } from "react";
import type { SubmitEvent } from "react";
import { updatePassword } from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";

export default function useProfil() {
    const token = localStorage.getItem('access_token')
    const { user } = useAuth()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (newPassword !== confirmPassword) {
            setError('Les mots de passes ne correspondent pas')
            return
        }

        try {
            await updatePassword(token!, currentPassword, newPassword)
            setSuccess(true)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return { currentPassword, setCurrentPassword, newPassword, setNewPassword,
        confirmPassword, setConfirmPassword, error, success, handleSubmit, user
    }
}