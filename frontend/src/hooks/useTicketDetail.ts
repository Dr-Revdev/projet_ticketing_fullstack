import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTicket } from "../services/TicketService";
import type { Ticket } from "../services/TicketService";

export default function useTicketDetail() {
    const { id } = useParams<{ id: string }>()

    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        fetchTicket(id).then(data => setTicket(data)).catch(err => setError(err.message)).finally(() => setLoading(false))
    }, [])

    return { ticket, loading, error }
}