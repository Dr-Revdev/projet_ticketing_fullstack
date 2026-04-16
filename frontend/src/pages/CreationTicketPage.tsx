import { Box, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import useCreateTicket from '../hooks/useCreateTicket'

export default function CreationTicketPage() {
    const { titre, setTitre, idCategorie, setIdCategorie, description, setDescription, categorie,
        fichiers, setFichiers, error, warning, handleSubmit } = useCreateTicket()

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Nouveau ticket
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {warning && <Alert severity="warning" sx={{ mb: 2 }}>{warning}</Alert>}

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1}}>
                <Button variant="outlined" component='label'>
                    Ajouter des fichiers
                    <input type="file" hidden multiple onChange={e => {
                        if (e.target.files) setFichiers(Array.from(e.target.files))
                    }} />
                </Button>

                {fichiers.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {fichiers.length} fichier(s) sélectionné(s)
                    </Typography>
                )}
                
                <Button type='submit' variant="contained" disabled={!titre || !idCategorie}>
                    Créer le ticket
                </Button>
            </Box>
        </Box>
    )
}