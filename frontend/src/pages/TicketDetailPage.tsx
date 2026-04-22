import { Box, Typography, Chip, Paper, CircularProgress, Alert, TextField, Button, MenuItem } from '@mui/material'
import { List, ListItem, ListItemText, Link } from '@mui/material';
import { useState, useEffect } from 'react'
import useTicketDetail from '../hooks/useTicketDetail'
import useTicketMessages from '../hooks/useTicketMessages'
import usePiecesJointes from '../hooks/usePiecesJointes'

import { etatColors } from '../utils/tickets'

const etats = [ 'nouveau', 'en_cours', 'en_attente', 'resolu', 'ferme' ]

export default function TicketDetailPage() {
    const { ticket, utilisateurs, loading, error, handleUpdate, isAgent, isManager } = useTicketDetail()
    const { messages, contenu, setContenu, error: msgError, handleSend } = useTicketMessages(ticket?.id_ticket)
    const { piecesJointes, error: pjError, handleUpload } = usePiecesJointes(ticket?.id_ticket)

    const [pendingEtat, setPendingEtat] = useState('')
    const [pendingAgent, setPendingAgent] = useState<string | null>(null)

    useEffect(() => {
        if (ticket) {
            setPendingEtat(ticket.etat)
            setPendingAgent(ticket.id_agent_assigne ?? null)
        }
    }, [ticket?.id_ticket])

    const hasChanges = ticket
        ? pendingEtat !== ticket.etat || pendingAgent !== (ticket.id_agent_assigne ?? null)
        : false

    const handleSave = () => {
        if (!hasChanges) return
        const patch: Record<string, unknown> = {}
        if (pendingEtat !== ticket!.etat) patch.etat = pendingEtat
        if (pendingAgent !== (ticket!.id_agent_assigne ?? null)) patch.id_agent_assigne = pendingAgent
        handleUpdate(patch)
    }

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
                        <TextField
                            value={pendingEtat}
                            onChange={e => setPendingEtat(e.target.value)}
                            select
                            size='small'
                            sx={{ minWidth: 200 }}
                            disabled={!isAgent}
                        >
                            {etats.map(etat => (
                                <MenuItem key={etat} value={etat}>
                                    <Chip
                                        label={etat}
                                        color={etatColors[etat] ?? 'default'}
                                        size='small'
                                    />
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box>
                        <Typography variant='subtitle2' color='text.secondary'>Agent assigné</Typography>
                        <TextField
                            value={pendingAgent ?? ''}
                            onChange={e => setPendingAgent(e.target.value || null)}
                            select
                            size='small'
                            sx={{ minWidth: 200 }}
                            disabled={!isManager}
                        >
                            <MenuItem value=''>
                                Non assigné
                            </MenuItem>
                            {utilisateurs.map(u => (
                                <MenuItem key={u.id_utilisateur} value={u.id_utilisateur}>
                                    {u.prenom} {u.nom}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {(isAgent || isManager) && (
                        <Box>
                            <Button
                                variant='contained'
                                size='small'
                                onClick={handleSave}
                                disabled={!hasChanges}
                            >
                                Sauvegarder
                            </Button>
                        </Box>
                    )}

                    <Box>
                        <Typography variant='subtitle2' color='text.secondary'>Date de création</Typography>
                        <Typography>{new Date(ticket.date_creation).toLocaleDateString('fr-FR')}</Typography>
                    </Box>

                    <Box>
                        <Typography variant='subtitle2' color='text.secondary'>Catégorie</Typography>
                        <Typography>{ticket.categories.libelle}</Typography>
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

            <Typography variant='h5' fontWeight='bold' mt={4} mb={2}>
                Pièces jointes
            </Typography>

            {pjError && <Alert severity='error' sx={{ mb: 2}}>{pjError}</Alert>}

            <List>
                {piecesJointes.length === 0 && (
                    <Typography color='text.secondary'> Aucune pièce jointe.</Typography>
                )}
                {piecesJointes.map(pj => (
                    <ListItem key={pj.id_piece_jointe}>
                        <ListItemText primary={
                            <Link href={`${import.meta.env.VITE_API_URL}${pj.url_path}`} target='_blank'>
                                {pj.nom_fichier}
                            </Link>
                        } />
                    </ListItem>
                ))}
            </List>

            <Button variant='outlined' component='label' sx={{ mt: 1 }}>
                Ajouter un fichier
                <input type='file' hidden onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(file)
                }} />
            </Button>
        </Box>
    )
}