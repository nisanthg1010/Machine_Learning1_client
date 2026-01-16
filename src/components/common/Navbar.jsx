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


                <Box sx={{ flexGrow: 1 }} />

                <IconButton color="inherit" sx={{ ml: 1 }}>
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
