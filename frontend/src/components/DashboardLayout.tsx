import { Box, Drawer, List, ListItemButton, ListItemText, AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DRAWER_WIDTH = 240

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tickets', path: '/tickets'},
    { label: 'Nouveau ticket', path: '/tickets/new' },
]

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Drawer
                variant='permanent'
                sx={{ 
                    width: DRAWER_WIDTH,
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' }
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map(item => (
                        <ListItemButton
                            key={item.path}
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            {/* Contenu principal */}
            <Box sx={{ flexGrow: 1 }}>
                {/* Header */}
                <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant='h6'>Gestion de Tickets</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant='body2'>
                                {user?.prenom} {user?.nom}
                            </Typography>
                            <Button color='inherit' onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Affichage de l'outlet de la page active */}
                <Box component='main' sx={{ p: 3, mt: 8 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}