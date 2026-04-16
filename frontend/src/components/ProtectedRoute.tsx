import { Navigate } from "react-router-dom";
import type { ReactNode } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { hasAtLeast } from "../utils/roles";

// Redirige vers /login si non connecté, vers /dashboard si rôle insuffisant.

export default function ProtectedRoute({ children, minRole }: { children: ReactNode, minRole?: string }) {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />
    if (minRole && !hasAtLeast(user.utilisateurs_roles, minRole)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}
