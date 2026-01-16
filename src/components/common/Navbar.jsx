import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Stack, Chip, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BoltIcon from '@mui/icons-material/Bolt';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = ({ onSidebarToggle }) => {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'rgba(7, 9, 20, 0.85)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onSidebarToggle}
                    sx={{ display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: '#9b6bff', width: 36, height: 36, boxShadow: '0 0 0 4px rgba(155,107,255,0.2)' }}>
                        <BoltIcon fontSize="small" />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(248,251,255,0.7)' }}>
                            Innoviative ML Studio
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Training Lab</Typography>
                    </Box>
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                <Chip
                    icon={<BoltIcon sx={{ color: '#ff4fb7' }} />}
                    label="Realtime Preview"
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'rgba(255,79,183,0.15)',
                        color: '#ffb6e5',
                        border: '1px solid rgba(255,79,183,0.3)'
                    }}
                />

                <IconButton color="inherit" sx={{ ml: 1 }}>
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
