import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography, Stack, Avatar, Divider, Button, useTheme, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SchoolIcon from '@mui/icons-material/School';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate, useLocation } from 'react-router-dom';
import { ModelContext, AuthContext } from '../../App';

const drawerWidth = 260;

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const modelContext = React.useContext(ModelContext);
    const latestModel = modelContext?.latestModel;
    const { user, logout } = React.useContext(AuthContext) || {};

    const primaryMenu = [
        { text: 'ML Categories', icon: <DashboardIcon />, path: '/categories' },
    ];

    const guideMenu = [
        { text: 'ML Process Guide', icon: <SchoolIcon />, path: '/ml-process' },
        { text: 'Preprocessing Guide', icon: <CleaningServicesIcon />, path: '/preprocessing' },
        { text: 'Training Guide', icon: <FitnessCenterIcon />, path: '/training-guide' },
    ];

    const drawerContent = (
        <>
            <Toolbar />
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: '#9b6bff', width: 44, height: 44, boxShadow: '0 0 0 5px rgba(155,107,255,0.18)' }}>ML</Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(248,251,255,0.65)' }}>Machine Learning</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Learners</Typography>
                    </Box>
                </Stack>

                <List dense disablePadding sx={{ display: 'grid', gap: 0 }}>
                    {primaryMenu.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <ListItemButton
                                key={item.text}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile && onClose) onClose();
                                }}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    background: active ? 'linear-gradient(135deg, rgba(155,107,255,0.35), rgba(255,79,183,0.2))' : 'rgba(255,255,255,0.03)',
                                    border: active ? '1px solid rgba(155,107,255,0.45)' : '1px solid rgba(255,255,255,0.06)',
                                    color: '#f8fbff',
                                    boxShadow: active ? '0 12px 30px -16px rgba(155,107,255,0.6)' : 'none'
                                }}
                            >
                                <ListItemIcon sx={{ color: active ? '#ffb6e5' : '#9fb1d0' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mb: -1 }}>Guides</Typography>
                <List dense disablePadding sx={{ display: 'grid', gap: 0 }}>
                    {guideMenu.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <ListItemButton
                                key={item.text}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile && onClose) onClose();
                                }}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    background: active ? 'linear-gradient(135deg, rgba(155,107,255,0.35), rgba(255,79,183,0.2))' : 'rgba(255,255,255,0.03)',
                                    border: active ? '1px solid rgba(155,107,255,0.45)' : '1px solid rgba(255,255,255,0.06)',
                                    color: '#f8fbff',
                                    boxShadow: active ? '0 12px 30px -16px rgba(155,107,255,0.6)' : 'none'
                                }}
                            >
                                <ListItemIcon sx={{ color: active ? '#ffb6e5' : '#9fb1d0' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                {/* Trained Model Info */}
                <Box sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(145deg, rgba(61,213,152,0.08), rgba(155,107,255,0.12))', border: '1px solid rgba(61,213,152,0.1)', maxHeight: '280px', overflowY: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: '#3dd598', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>
                        📊 Latest Model
                    </Typography>
                    
                    {latestModel ? (
                        <>
                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Model Name</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{latestModel.modelName}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Dataset</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.dataset}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Accuracy</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.accuracy}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Precision</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.precision}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Recall</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.recall}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>F1-Score</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.f1Score}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Features</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.features} features</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Training Time</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.trainingTime}</Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Samples</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.samples}</Typography>
                            </Box>

                            <Box sx={{ mb: 0 }}>
                                <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', mb: 0.3 }}>Status</Typography>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#3dd598' }}>{latestModel.status}</Typography>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                                No model trained yet.<br />Start training on the Dashboard!
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 2 }} />

                <Box sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(145deg, rgba(255,79,183,0.08), rgba(155,107,255,0.12))', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {user ? (
                        <>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(248,251,255,0.75)' }}>Signed in</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(248,251,255,0.6)' }}>{user.email}</Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => { logout && logout(); navigate('/login'); }}
                                sx={{ mt: 1.5, borderRadius: 2, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(248,251,255,0.75)' }}>Welcome</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(248,251,255,0.6)', mb: 1 }}>Login or sign up to save datasets and experiments.</Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<WhatshotIcon />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #ff4fb7, #9b6bff)',
                                    boxShadow: '0 12px 32px -16px rgba(255,79,183,0.6)'
                                }}
                            >
                                Login / Sign Up
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </>
    );

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? open : true}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    background: 'rgba(7,9,20,0.92)',
                    backdropFilter: 'blur(14px)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    color: '#f8fbff',
                    paddingX: 2,
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

export default Sidebar;
