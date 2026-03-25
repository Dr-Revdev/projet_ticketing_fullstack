import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, MenuItem, Alert, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import useUtilisateurs from '../hooks/useUtilisateurs'

export default function UtilisateursPage() {
    const {
        utilisateurs, equipes, roles, error,
        nom, setNom, prenom, setPrenom, email, setEmail, password, 
        setPassword, idEquipe, setIdEquipe, idRole, setIdRole,
        handleCreate, handleDelete,
    } = useUtilisateurs()

    return (
        <Box>
            <Typography variant='h4' fontWeight='bold' mb={3}>
                Gestion des utilisateurs
            </Typography>

            {error && <Alert severity='error' sx={{ mb: 2}}>{error}</Alert> }

            {/* Formulaire de création */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant='h6' mb={2}>Nouvel utilisateur</Typography>
                <Box component='form' onSubmit={handleCreate} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <TextField label='Nom' value={nom} onChange={e => setNom(e.target.value)} required size='small' />
                    <TextField label='Prénom' value={prenom} onChange={e => setPrenom(e.target.value)} required size='small' />
                    <TextField label='Email' value={email} onChange={e => setEmail(e.target.value)} required type='email' size='small' />
                    <TextField label='Mot de passe' value={password} onChange={e => setPassword(e.target.value)} required type='password' size='small' />
                    <TextField label='Équipe' value={idEquipe} onChange={e => setIdEquipe(e.target.value)} required size='small' sx={{ minWidth: 150 }}>
                        {equipes.map(eq => (
                            <MenuItem key={eq.id_equipe} value={eq.id_equipe}>{eq.nom}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label='Rôle' value={idRole} onChange={e => setIdRole(e.target.value)} select required size='small' sx={{ minWidth: 150}}>
                        {roles.map(r => (
                            <MenuItem key={r.id_role} value={r.id_role}>{r.libelle}</MenuItem>
                        ))}
                    </TextField>
                    <Button type='submit' variant='contained'>Créer</Button>
                </Box>
            </Paper>

            {/* Liste */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Équipe</TableCell>
                            <TableCell>Rôle</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {utilisateurs.map(u => (
                            <TableRow key={u.id_utilisateur}>
                                <TableCell>{u.nom}</TableCell>
                                <TableCell>{u.prenom}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.id_equipe}</TableCell>
                                <TableCell>
                                    {u.utilisateurs_roles.map(ur => ur.roles.libelle).join(', ')}
                                </TableCell>
                                <TableCell>
                                    <IconButton color='error' onClick={() => handleDelete(u.id_utilisateur)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}