import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleStartDemo = () => {
        navigate('/categories');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <Chip
                                icon={<WhatshotIcon sx={{ color: '#ffb6e5' }} />}
                                label="Realtime ML Studio"
                                sx={{
                                    bgcolor: 'rgba(155,107,255,0.16)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#f8fbff',
                                    mb: 2,
                                    borderRadius: 2,
                                    px: 1.5
                                }}
                            />
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2.4rem', md: '3.8rem' },
                                    mb: 2,
                                    lineHeight: 1.1,
                                    background: 'linear-gradient(120deg, #ffffff 0%, #c6a4ff 40%, #ffb6e5 80%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Build, Tune, and Visualize ML Experiments
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ mb: 4, color: 'rgba(248,251,255,0.72)', maxWidth: 620, lineHeight: 1.6 }}
                            >
                                Launch into a guided Training Lab with algorithm cards, live progress, and step-by-step visualizations.
                                Upload datasets, pick targets, and see neon-rich dashboards instantly.
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleStartDemo}
                                    endIcon={<PlayArrowIcon />}
                                    sx={{
                                        py: 1.4,
                                        px: 4,
                                        fontSize: '1.05rem',
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #ff4fb7, #9b6bff)',
                                        boxShadow: '0 16px 40px -18px rgba(255,79,183,0.65)'
                                    }}
                                >
                                    Launch Interface
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    sx={{
                                        borderRadius: 2,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        color: '#f8fbff',
                                        px: 3
                                    }}
                                    onClick={() => navigate('/categories')}
                                >
                                    View Categories
                                </Button>
                            </Stack>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'linear-gradient(145deg, rgba(16,21,38,0.9), rgba(10,15,28,0.9))',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    boxShadow: '0 25px 60px -35px rgba(0,0,0,0.8)'
                                }}
                            >
                                <Stack spacing={2}>
                                    <Typography variant="subtitle1" sx={{ color: 'rgba(248,251,255,0.72)' }}>
                                        Quick Actions
                                    </Typography>
                                    {['Upload Dataset', 'Select Target', 'Configure Model', 'Visualize Results'].map((item, i) => (
                                        <Box
                                            key={item}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                color: '#f8fbff'
                                            }}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '12px',
                                                    background: ['#9b6bff22', '#ff4fb722', '#3dd59822', '#64b5f622'][i % 4],
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    display: 'grid',
                                                    placeItems: 'center'
                                                }}>
                                                    <Typography sx={{ fontWeight: 700 }}>{i + 1}</Typography>
                                                </Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item}</Typography>
                                            </Stack>
                                            <Chip label="Guided" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#dfe7ff' }} />
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;
