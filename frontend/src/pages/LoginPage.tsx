import { Box, Typography, Stack, TextField, Alert, Button, Paper } from "@mui/material"
import { useState } from "react"
import { useLogin } from "../hooks/useLogin"



export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { handleLogin, error } = useLogin()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email.trim() || !password.trim()) return
        await handleLogin(email, password)
    }

    return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                    <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Adresse e-mail"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />

                            <TextField
                                label="Mot de passe"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />

                            {error && (
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            )}

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
                    </Box>
                </Paper>
            </Box>
            
    )
}
