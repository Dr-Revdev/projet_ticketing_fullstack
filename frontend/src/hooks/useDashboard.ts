import { useEffect, useState } from "react";
import { fetchTickets } from "../services/TicketService";
import type { Ticket } from "../services/TicketService";

export default function useDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTickets()
            .then(data => setTickets(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const countByEtat = (etat: string) => tickets.filter(t => t.etat === etat).length

    const recents = [...tickets]
        .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
        .slice(0, 5)

        return { loading, error, countByEtat, recents }
}