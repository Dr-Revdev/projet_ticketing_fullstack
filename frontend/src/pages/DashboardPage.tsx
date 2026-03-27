import { Box, Typography, Card, CardContent, CircularProgress, 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import useDashboard from '../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

const etats = [
    { key: 'nouveau', label: 'Nouveau', color: '#0288d1' },
    { key: 'en_cours', label: 'En cours', color: '#ed6c02' },
    { key: 'en_attente', label: 'En attente', color: '#9e9e9e' },
    { key: 'resolu', label: 'Résolu', color: '#2e7d32' },
    { key: 'ferme', label: 'Fermé', color: '#d32f2f' },
]

const etatColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
    nouveau: 'info',
    en_cours: 'warning',
    en_attente: 'default',
    resolu: 'success',
    ferme: 'error',
}

export default function DashboardPage() {
    const { user } = useAuth()
    const { loading, error, countByEtat, recents } = useDashboard()
    const navigate = useNavigate()

    if (loading) return <CircularProgress />
    if (error) return <Typography color='error'>{error}</Typography>

    return (
        <Box>
            <Typography variant='h4' fontWeight='bold' mb={2}>
                Bienvenue, {user?.prenom} !
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {etats.map(etat => (
                    <Card key={etat.key} sx={{ minWidth: 140 }}>
                        <CardContent>
                            <Typography variant='h3' fontWeight='bold' color={etat.color}>
                                {countByEtat(etat.key)}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {etat.label}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Typography variant='h6' fontWeight='bold' mt={4} mb={2}>
                Tickets récents
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Titre</TableCell>
                            <TableCell>État</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recents.map(ticket => (
                            <TableRow
                                key={ticket.id_ticket}
                                onClick={() => navigate(`/tickets/${ticket.id_ticket}`)}
                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover'} }}
                            >
                                <TableCell>{ticket.titre}</TableCell>
                                <TableCell>
                                    <Chip label={ticket.etat} color={etatColors[ticket.etat] ?? 'default'} size='small' />
                                </TableCell>
                                <TableCell>{new Date(ticket.date_creation).toLocaleDateString('fr-FR')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}