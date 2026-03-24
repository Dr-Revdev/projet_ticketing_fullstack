import { Box, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import useCreateTicket from '../hooks/useCreateTicket'

export default function CreationTicketPage() {
    const { titre, setTitre, idCategorie, setIdCategorie, description, setDescription, categorie, error, handleSubmit } = useCreateTicket()

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Nouveau ticket
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                label='Titre'
                value={titre}
                onChange={e => setTitre(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
            />

            <TextField 
                label="Catégorie" 
                value={idCategorie} 
                onChange={e => setIdCategorie(e.target.value)}
                select
                fullWidth
                required
                sx={{ mb: 3 }}
            >
                {categorie.map(cat => (
                    <MenuItem key={cat.id_categorie} value={cat.id_categorie}>
                        {cat.libelle}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label='Description du problème'
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
                sx={{ mb: 3 }}
            />
            
            <Button type='submit' variant="contained" disabled={!titre || !idCategorie}>
                Créer le ticket
            </Button>
        </Box>
    )
}