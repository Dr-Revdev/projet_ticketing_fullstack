import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchTicket, updateTicket } from "../services/TicketService"
import { fetchUtilisateurs } from '../services/UtilisateurService'
import type { Utilisateur } from '../services/UtilisateurService'
import type { Ticket } from "../services/TicketService";
import { useAuth } from '../contexts/AuthContext'
import { hasAtLeast } from '../utils/roles'

export default function useTicketDetail() {
    const { id } = useParams<{ id: string }>()

    const { user } = useAuth()
    const isAgent = !!user && hasAtLeast(user.utilisateurs_roles, 'agent')
    const isManager = !!user && hasAtLeast(user.utilisateurs_roles, 'mannager')

    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        Promise.all([
            fetchTicket(id),
            fetchUtilisateurs(),
        ]).then(([ticketData, utilisateursData]) => {
            setTicket(ticketData)
            setUtilisateurs(utilisateursData)
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))

        
    }, [id])

    const handleUpdate = async (data: Partial<Ticket>) => {
        if (!id) return

        try {
            const updated = await updateTicket(id, data)
            setTicket(updated)
        } catch (err: any) {
            setError(err.message)
        }
    }

    return { ticket, utilisateurs, loading, error, handleUpdate, isAgent, isManager }
}