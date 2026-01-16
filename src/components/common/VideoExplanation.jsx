import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
    { label: 'Preprocessing', color: '#f48fb1', description: 'Handling missing values & Scaling' },
    { label: 'Feature Selection', color: '#90caf9', description: 'Identifying important features' },
    { label: 'Model Training', color: '#a5d6a7', description: 'Optimizing weights & biases' },
    { label: 'Evaluation', color: '#ce93d8', description: 'Calculating accuracy & loss' }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 1.5 // Delay between steps
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
};

const VideoExplanation = () => {
    return (
        <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
            <Typography variant="h6" align="center" gutterBottom>
                ML Pipeline Execution
            </Typography>
            <Paper
                component={motion.div}
                variants={container}
                initial="hidden"
                animate="show"
                sx={{
                    p: 3,
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                }}
            >
                {steps.map((step, index) => (
                    <Box
                        component={motion.div}
                        variants={item}
                        key={step.label}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 150
                        }}
                    >
                        <Box
                            component={motion.div}
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 0, 360, 360, 0]
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                times: [0, 0.2, 0.5, 0.8, 1],
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                bgcolor: step.color,
                                mb: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            <Typography variant="h4" color="black">{index + 1}</Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">{step.label}</Typography>
                        <Typography variant="caption" align="center" color="text.secondary">{step.description}</Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default VideoExplanation;
