import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, useMediaQuery, useTheme, Divider } from '@mui/material'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { hasAtLeast } from '../utils/roles'
import { useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PeopleIcon from '@mui/icons-material/People'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'

const DRAWER_WIDTH = 250

const menuItems = (isAdmin: boolean) => [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Tickets', path: '/tickets', icon: <ConfirmationNumberIcon /> },
    { label: 'Nouveau ticket', path: '/tickets/new', icon: <AddCircleOutlineIcon /> },
    ...(isAdmin ? [{ label: 'Utilisateurs', path: '/utilisateurs', icon: <PeopleIcon /> }] : []),
]

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [drawerOpen, setDrawerOpen] = useState(false)

    const isAdmin = !!(user && hasAtLeast(user.utilisateurs_roles, 'admin'))
    const items = menuItems(isAdmin)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <Box sx={{ p: 3, pb: 2 }}>
                <Typography variant='h6' fontWeight='bold' color='primary'>
                    TicketApp
                </Typography>
            </Box>

            <Divider sx={{ borderColor: '#2d3148' }} />

            {/* Menu */}
            <List sx={{ flex: 1, px: 1, pt: 1 }}>
                {items.map(item => {
                    const active = location.pathname === item.path
                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => { navigate(item.path); if (isMobile) setDrawerOpen(false) }}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                backgroundColor: active ? 'primary.main' : 'transparent',
                                '&:hover': {
                                    backgroundColor: active ? 'primary.dark' : 'rgba(99,102,241,0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, color: active ? 'white' : 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                slotProps={{ primary: { fontSize: 14, fontWeight: active ? 600 : 400, color: active ? 'white' : 'text.primary' } }}
                            />
                        </ListItemButton>
                    )
                })}
            </List>

            <Divider sx={{ borderColor: '#2d3148' }} />

            {/* Profil en bas */}
            <Box
                sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(99,102,241,0.08)' }, borderRadius: 2, m: 1 }}
                onClick={() => navigate('/profil')}
            >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                </Avatar>
                <Box>
                    <Typography variant='body2' fontWeight={600}>{user?.prenom} {user?.nom}</Typography>
                    <Typography variant='caption' color='text.secondary'>{user?.utilisateurs_roles[0]?.roles.libelle}</Typography>
                </Box>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* AppBar mobile uniquement */}
            {isMobile && (
                <AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton color='inherit' edge='start' onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6' fontWeight='bold' sx={{ flex: 1 }}>TicketApp</Typography>
                        <IconButton color='inherit' onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? drawerOpen : true}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    width: DRAWER_WIDTH,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        borderRight: '1px solid #2d3148',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Contenu principal */}
            <Box component='main' sx={{ flexGrow: 1, p: 3, mt: isMobile ? 8 : 0, ml: isMobile ? 0 : 0 }}>
                <Outlet />
            </Box>
        </Box>
    )
}