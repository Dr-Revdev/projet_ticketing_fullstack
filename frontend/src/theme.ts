import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
        },
        secondary: {
            main: '#22d3ee',
        },
        background: {
            default: '#0f1117',
            paper: '#1a1d27'
        },
        text: {
            primary: '#e2e8f0',
            secondary: '#94a3b8',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Roboto, system-ui, sans-serif',
        h4: { fontWeight: 700 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid #2d3148',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        color: '#94a3b8',
                        fontWeight: 600,
                        borderBottom: '1px solid #2d3148',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #1e2235',
                },
            },
        },
    },
})

export default theme