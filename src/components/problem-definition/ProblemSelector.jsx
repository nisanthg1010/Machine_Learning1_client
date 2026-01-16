import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Stack, Chip } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CategoryIcon from '@mui/icons-material/Category';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import HubIcon from '@mui/icons-material/Hub';

const ProblemSelector = ({ onSelect }) => {
    const problemTypes = [
        {
            id: 'regression',
            title: 'Regression',
            description: 'Predict numerical values based on input features.',
            icon: <ShowChartIcon sx={{ fontSize: 60, color: '#90caf9' }} />,
        },
        {
            id: 'classification',
            title: 'Classification',
            description: 'Categorize data into distinct classes or groups.',
            icon: <CategoryIcon sx={{ fontSize: 60, color: '#f48fb1' }} />,
        },
        {
            id: 'clustering',
            title: 'Clustering',
            description: 'Discover natural groupings within unlabeled data.',
            icon: <BubbleChartIcon sx={{ fontSize: 60, color: '#a5d6a7' }} />,
        },
        {
            id: 'neural_network',
            title: 'Neural Networks',
            description: 'Deep learning models for complex pattern recognition.',
            icon: <HubIcon sx={{ fontSize: 60, color: '#ce93d8' }} />,
        },
    ];

    const handleSelect = (id) => {
        if (onSelect) {
            onSelect(id);
        }
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Chip label="Step 1" sx={{ bgcolor: 'rgba(155,107,255,0.18)', color: '#f8fbff', borderRadius: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Choose a Problem Type</Typography>
            </Stack>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Select the learning objective to tailor algorithms, preprocessing, and evaluation.
            </Typography>

            <Grid container spacing={2.5}>
                {problemTypes.map((type) => (
                    <Grid item xs={12} sm={6} md={3} key={type.id}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 18px 40px -24px rgba(0,0,0,0.8)'
                            }}
                        >
                            <CardActionArea
                                sx={{ height: '100%', p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: 1.5 }}
                                onClick={() => handleSelect(type.id)}
                            >
                                <Box sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '18px',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    color: '#c6d6ff'
                                }}>
                                    {type.icon}
                                </Box>
                                <CardContent sx={{ p: 0 }}>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700 }}>
                                        {type.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {type.description}
                                    </Typography>
                                </CardContent>
                                <Chip label="Select" size="small" sx={{ mt: 'auto', bgcolor: 'rgba(155,107,255,0.18)', color: '#f8fbff' }} />
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProblemSelector;
