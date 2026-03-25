import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material'
import useChangePassword from '../hooks/useChangePassword'

export default function ChangePasswordPage() {
    const { newPassword, setNewPassword, confirmPassword, setConfirmPassword, error, handleSubmit } = useChangePassword()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant='h5' fontWeight='bold' mb={1}>
                    Changement de mot de passe
                </Typography>
                <Typography variant='body2' color='text.secondary' mb={3}>
                    Première connexion — veuillez définir un nouveau mot de passe.
                </Typography>

                {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

                <Box component='form' onSubmit={handleSubmit}>
                    <TextField
                        label='Nouveau mot de passe'
                        type='password'
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label='Confirmer le mot de passe'
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        fullWidth
                        disabled={!newPassword || !confirmPassword}
                    >
                        Valider
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}