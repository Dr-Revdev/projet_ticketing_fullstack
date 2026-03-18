import { Box, Typography, Stack, TextField, Alert, Button } from "@mui/material"
import { useState } from "react"



export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
    setError('Veuillez renseigner votre adresse e-mail et votre mot de passe.')
    return
    }

    setError('')
    }
    return (
        <Box>
            <Typography>
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
        </Box>
    )
}
