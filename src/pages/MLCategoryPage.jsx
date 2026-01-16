import React, { useContext } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea, Stack, Chip } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { AuthContext } from '../App';

const MLCategoryPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const categories = [
        {
            id: 'supervised',
            title: 'Supervised Learning',
            icon: <AutoGraphIcon sx={{ fontSize: 64 }} />,
            description: 'Classification & Regression with labeled data',
            color: '#9b6bff',
            gradient: 'linear-gradient(135deg, #9b6bff 0%, #7a4fd1 100%)',
            examples: 'Linear/Logistic Regression, Decision Trees, Random Forest, SVM, KNN'
        },
        {
            id: 'unsupervised',
            title: 'Unsupervised Learning',
            icon: <BubbleChartIcon sx={{ fontSize: 64 }} />,
            description: 'Clustering & dimensionality reduction without labels',
            color: '#3dd598',
            gradient: 'linear-gradient(135deg, #3dd598 0%, #2ba87f 100%)',
            examples: 'K-Means, DBSCAN, PCA, Hierarchical Clustering, Gaussian Mixture'
        },
        {
            id: 'reinforcement',
            title: 'Reinforcement Learning',
            icon: <AccountTreeIcon sx={{ fontSize: 64 }} />,
            description: 'Agent-based learning through rewards & penalties',
            color: '#ff4fb7',
            gradient: 'linear-gradient(135deg, #ff4fb7 0%, #d63a94 100%)',
            examples: 'Q-Learning, Deep Q-Network, Policy Gradient, Actor-Critic'
        },
        {
            id: 'neural',
            title: 'Neural Networks',
            icon: <PsychologyIcon sx={{ fontSize: 64 }} />,
            description: 'Deep learning with artificial neural networks',
            color: '#ffa726',
            gradient: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
            examples: 'CNN, RNN, LSTM, GAN, Transformer, Autoencoder'
        }
    ];

    return (
        <Box sx={{ minHeight: '80vh', py: 6 }}>
            <Container maxWidth="lg">
                <Stack spacing={2} sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #9b6bff 0%, #ff4fb7 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Choose Your ML Journey
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
                        Select a machine learning category to start training models
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                        <Chip label={`Welcome, ${user.name}`} color="primary" />
                        <Chip label="All categories available" color="success" variant="outlined" />
                    </Stack>
                </Stack>

                <Grid container spacing={3}>
                    {categories.map((category) => (
                        <Grid item xs={12} md={6} key={category.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    background: 'linear-gradient(145deg, rgba(16,21,38,0.94), rgba(9,12,24,0.94))',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 20px 60px -10px ${category.color}40`,
                                        border: `1px solid ${category.color}60`
                                    }
                                }}
                            >
                                <CardActionArea onClick={() => navigate(`/workflow/${category.id}`)} sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Stack spacing={2}>
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 3,
                                                    background: category.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    mb: 1,
                                                    boxShadow: `0 12px 30px -8px ${category.color}50`
                                                }}
                                            >
                                                {category.icon}
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: category.color }}>
                                                {category.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', minHeight: 48 }}>
                                                {category.description}
                                            </Typography>
                                            <Box sx={{ pt: 1 }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                                    ALGORITHMS:
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                                                    {category.examples}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        💡 Each category includes dataset upload, train/test split, algorithm selection, hyperparameter tuning, and live training visualization
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default MLCategoryPage;
