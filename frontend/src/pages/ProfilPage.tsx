import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material'
import useProfil from '../hooks/useProfil'

export default function ProfilPage() {
    const { currentPassword, setCurrentPassword, newPassword, setNewPassword, 
        confirmPassword, setConfirmPassword, error, success, handleSubmit, user 
    } = useProfil()

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant='h4' fontWeight='bold' mb={3}>Mon profil</Typography>
            <Paper sx={{ p: 3, maxWidth: 400, mb: 3 }}>
                <Typography variant='h6' mb={2}>Mes informations</Typography>
                <Typography><strong>Nom :</strong> {user?.nom} {user?.prenom}</Typography>
                <Typography><strong>Email :</strong> {user?.email}</Typography>
                <Typography><strong>Équipe :</strong> {user?.equipes?.nom}</Typography>
                <Typography><strong>Rôle :</strong> {user?.utilisateurs_roles.map(ur => ur.roles.libelle).join(', ')}</Typography>
            </Paper>
            <Paper sx={{ p: 3, maxWidth: 400 }}>
                <Typography variant='h6' mb={2}>Changer le mot de passe</Typography>


                {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity='success' sx={{ mb: 2 }}>Mot de passe modifié avec succès</Alert>}

                <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label='Mot de passe actuel' type='password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required size='small' />
                    <TextField label='Nouveau mot de passe' type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} required size='small' />
                    <TextField label='Confirmer le mot de passe' type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required size='small' />
                    <Button type='submit' variant='contained'>Modifier</Button>
                </Box>
            </Paper>
        </Box>
    )
}
