import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                background: 'transparent',
                color: '#e8f0ff'
            }}
        >
            <CssBaseline />
            <Navbar onSidebarToggle={handleDrawerToggle} />
            <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
