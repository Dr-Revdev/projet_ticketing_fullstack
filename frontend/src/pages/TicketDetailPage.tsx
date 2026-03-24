import { Box, Typography, Chip, Paper, CircularProgress, Alert, TextField, Button } from '@mui/material'
import useTicketDetail from '../hooks/useTicketDetail'
import useTicketMessages from '../hooks/useTicketMessages'

const etatColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
    nouveau: 'info',
    en_cours: 'warning',
    en_attente: 'default',
    resolu: 'success',
    ferme: 'error',
}

export default function TicketDetailPage() {
    const { ticket, loading, error } = useTicketDetail()
    const { messages, contenu, setContenu, error: msgError, handleSend } = useTicketMessages(ticket?.id_ticket)

    if (loading) return <CircularProgress />
    if (error) return <Typography color='error'>{error}</Typography>
    if (!ticket) return <Typography>Ticket introuvable</Typography>

    return (
        <Box>
            <Typography variant='h4' fontWeight='bold' mb={3}>
                {ticket.titre}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant='subtitle2' color='text.secondary'>État</Typography>
                        <Chip
                            label={ticket.etat}
                            color={etatColors[ticket.etat] ?? 'default'}
                            size='small'
                        />
                    </Box>

                    <Box>
                        <Typography variant='subtitle2' color='text.secondary'>Date de création</Typography>
                        <Typography>{ticket.id_categorie}</Typography>
                    </Box>

                    <Box>
                        <Typography variant='subtitle2' color='text.secondary'>Résultat</Typography>
                        <Typography>{ticket.resultat ?? 'Aucun'}</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Messages */}
            <Typography variant='h5' fontWeight='bold' mb={2}>
                Messages
            </Typography>

            {msgError && <Alert severity='error' sx={{ mb: 2 }}>{msgError}</Alert>}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                {messages.length === 0 && (
                    <Typography color='text.secondary'>Aucun message pour l'instant.</Typography>
                )}
                {messages.map(msg => (
                    <Paper key={msg.id_message} sx={{ p: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                            {msg.utilisateurs.prenom} {msg.utilisateurs.nom} - {new Date(msg.date_message).toLocaleDateString('fr-FR')}
                        </Typography>
                        <Typography>{msg.contenu}</Typography>
                    </Paper>
                ))}
            </Box>

            <Box component='form' onSubmit={handleSend} sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    value={contenu}
                    onChange={e => setContenu(e.target.value)}
                    placeholder='Écrire un message...'
                    fullWidth
                    size='small'
                />
                <Button type='submit' variant='contained' disabled={!contenu.trim()}>
                    Envoyer
                </Button>
            </Box>
        </Box>
    )
}