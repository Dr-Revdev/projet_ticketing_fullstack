import { fetchCategories, createTicket } from "../services/TicketService"
import type { Categorie } from "../services/TicketService"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { SubmitEvent } from 'react'
import { createMessage } from '../services/MessageService'
import { uploadPieceJointe } from "../services/PieceJointeService"

export default function useCreateTicket() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [titre, setTitre] = useState('')
    const [idCategorie, setIdCategorie] = useState('')
    const [description, setDescription] = useState('')
    const [categorie, setCategorie] = useState<Categorie[]>([])
    const [error, setError] = useState<string | null>(null)
    const [fichiers, setFichiers] = useState<File[]>([])

    useEffect(() => {
        fetchCategories().then(data => setCategorie(data)).catch(err => setError(err.message))
    }, [])

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)

        if (!user) return

        try {
            const ticket = await createTicket({
                titre,
                etat: 'nouveau',
                id_categorie: idCategorie,
            })

            await createMessage({
                contenu: description,
                visibilite: 'public',
                id_ticket: ticket.id_ticket,
            })

            for (const fichier of fichiers) {
                await uploadPieceJointe(ticket.id_ticket, fichier)
            }

            navigate('/tickets')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return { titre, setTitre, idCategorie, setIdCategorie, description, setDescription,
        fichiers, setFichiers, categorie, error, handleSubmit }
}