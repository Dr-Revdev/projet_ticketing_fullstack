import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'
import { fetchMe } from '../services/AuthService'
import type { UserProfile } from '../services/AuthService'
import { setUnauthorizedCallback } from '../services/apiClient';


// Définition de la boite
type AuthContextType = {
    user: UserProfile | null
    login: (token: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const logout = () => {
        localStorage.removeItem('access_token')
        setUser(null)
    }

    const login = async (token: string) => {
        localStorage.setItem('access_token', token)
        const profile = await fetchMe()
        setUser(profile)
    }

    useEffect(() => {
        setUnauthorizedCallback(logout)
        const token = localStorage.getItem('access_token')
        if (!token) {
            setLoading(false)
            return
        }
        fetchMe().then(profile => setUser(profile)).catch(() => localStorage.removeItem('access_token')).finally(() => setLoading(false))
    }, [])

    if (loading) return null

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

// Hook pour accès à la boite depuis les composants
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
    return context
}