import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth()

    return (
        <Box>
            <Typography variant='h4' fontWeight='bold' mb={2}>
                Bienvenue, {user?.prenom} !
            </Typography>
        </Box>
    )
}