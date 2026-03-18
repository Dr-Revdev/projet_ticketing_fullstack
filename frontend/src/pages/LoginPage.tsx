import { Box, Typography, Stack, TextField, Alert, Button, Container, Paper, Snackbar } from "@mui/material"
import { useState } from "react"
import { login } from "../services/auth.service"



export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [errorOpen, setErrorOpen] = useState(false)

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!email.trim() || !password.trim()) {
        setError('Veuillez renseigner votre adresse e-mail et votre mot de passe.')
        setErrorOpen(true)
        return
        }

        setError('')
        setErrorOpen(false)

        try {
            const data = await login({
                email,
                password,
            });

            console.log(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion.'

            setError(message)
            setErrorOpen(true)
        }

    }
    return (
        <>
            <Container maxWidth="sm">
                <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stack spacing={3} sx={{ width: '100%'}}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Paper elevation={10} sx={{ width: '100%', p: 4, borderRadius: 4 }}>
                                <Typography variant="h4" fontWeight={700}>
                                    Connexion
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                    label="Adresse e-mail"
                                    type="email"
                                    fullWidth
                                    value={email}
                                    onChange={(event) => {
                                    setEmail(event.target.value)
                                    if (errorOpen) {
                                        setErrorOpen(false)
                                    }
                                    }}
                                    />

                                    <TextField
                                    label="Mot de passe"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(event) => {
                                    setPassword(event.target.value)
                                    if (errorOpen) {
                                        setErrorOpen(false)
                                    }
                                    }}
                                    />

                                    <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ py: 1.4, borderRadius: 2 }}
                                    >
                                    Se connecter
                                    </Button>
                                </Stack>
                            </Paper>
                        </Box>
                    </Stack>
                </Box>
            </Container>
            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setErrorOpen(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}
