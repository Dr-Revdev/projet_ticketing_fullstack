import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useTickets from '../hooks/useTickets'

const etatColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
    nouveau: 'info',
    en_cours: 'warning',
    en_attente: 'default',
    resolu: 'success',
    ferme: 'error',
}

const etats = ['', 'nouveau', 'en_cours', 'en_attente', 'resolu', 'ferme']

export default function TicketsPage() {
    const { tickets, categories, error, filtreEtat, setFiltreEtat, filtreCategorie, setFiltreCategorie, filtreTitre, setFiltreTitre } = useTickets()
    const navigate = useNavigate()

    if (error) return <Typography color='error'>{error}</Typography>

    return (
        <Box>
            <Typography variant='h4' fontWeight='bold' mb={3}>
                Tickets
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    label='Recherche'
                    value={filtreTitre}
                    onChange={e => setFiltreTitre(e.target.value)}
                    size='small'
                    sx={{ minWidth: 200 }}
                />
                <TextField
                    label='État'
                    value={filtreEtat}
                    onChange={e => setFiltreEtat(e.target.value)}
                    select
                    size='small'
                    sx={{ minWidth: 150 }}
                >
                    {etats.map(e => (
                        <MenuItem key={e} value={e}>{e || 'Tous'}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label='Catégorie'
                    value={filtreCategorie}
                    onChange={e => setFiltreCategorie(e.target.value)}
                    select
                    size='small'
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value=''>Toutes</MenuItem>
                    {categories.map(cat => (
                        <MenuItem key={cat.id_categorie} value={cat.id_categorie}>{cat.libelle}</MenuItem>
                    ))}
                </TextField>
            </Box>

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
                                    <Chip label={ticket.etat} color={etatColors[ticket.etat] ?? 'default'} size='small' />
                                </TableCell>
                                <TableCell>{new Date(ticket.date_creation).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell>{ticket.categories.libelle}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
