import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchMessages, createMessage } from '../services/MessageService'
import type { Message } from '../services/MessageService'

export default function useTicketMessage(idTicket: string | undefined) {
    const { user } = useAuth()

    const [messages, setMessages] = useState<Message[]>([])
    const [contenu, setContenu] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!idTicket) return

        fetchMessages(idTicket).then(data => setMessages(data)).catch(err => setError(err.message))
    }, [idTicket])

    const handleSend = async (e: SubmitEvent) => {
        e.preventDefault()
        if (!user || !idTicket || !contenu.trim()) return

        try {
            const nouveau = await createMessage({
                contenu,
                visibilite: 'public',
                id_utilisateur: user.id_utilisateur,
                id_ticket: idTicket,
            })
            setMessages(prev => [...prev, nouveau])
            setContenu('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    return { messages, contenu, setContenu, error, handleSend }
}