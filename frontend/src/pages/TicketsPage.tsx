import { useEffect, useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { fetchTickets } from '../services/TicketService'
import type { Ticket } from '../services/TicketService'
import { useNavigate } from 'react-router-dom'

const etatColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
    nouveau: 'info',
    en_cours: 'warning',
    en_attente: 'default',
    resolu: 'success',
    ferme: 'error',
}

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTickets().then(data => setTickets(data)).catch(err => setError(err.message))
    }, [])

    if (error) return <Typography color='error'>{error}</Typography>

    return (
        <Box>
            <Typography variant='h4' fontWeight='bold' mb={3}>
                Tickets
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Titre</TableCell>
                            <TableCell>État</TableCell>
                            <TableCell>Date de création</TableCell>
                            <TableCell>Catégorie</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map(ticket => (
                            <TableRow 
                                key={ticket.id_ticket}
                                onClick={() => navigate(`/tickets/${ticket.id_ticket}`)}
                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                            >
                                <TableCell>{ticket.titre}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={ticket.etat}
                                        color={etatColors[ticket.etat] ?? 'default'}
                                        size='small'
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(ticket.date_creation).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell>{ticket.id_categorie}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}