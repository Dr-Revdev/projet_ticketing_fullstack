import { useEffect, useState } from 'react'
import { fetchTickets } from '../services/TicketService'
import type { Ticket } from '../services/TicketService'
import { fetchCategories } from '../services/TicketService'
import type { Categorie } from '../services/TicketService'

export default function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [categories, setCategories] = useState<Categorie[]>([])
    const [error, setError] = useState<string | null>(null)

    const [filtreEtat, setFiltreEtat] = useState('')
    const [filtreCategorie, setFiltreCategorie] = useState('')
    const [filtreTitre, setFiltreTitre] = useState('')

    useEffect(() => {
        fetchCategories()
            .then(data => setCategories(data))
            .catch(err => setError(err.message))
    }, [])

    useEffect(() => {
        fetchTickets({
            etat: filtreEtat || undefined,
            id_categorie: filtreCategorie || undefined,
            titre: filtreTitre || undefined,
        })
            .then(data => setTickets(data))
            .catch(err => setError(err.message))
    }, [filtreEtat, filtreCategorie, filtreTitre])

    return { tickets, categories, error, filtreEtat, setFiltreEtat, filtreCategorie, setFiltreCategorie, filtreTitre, setFiltreTitre }
}
