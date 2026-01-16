import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid, Paper, Switch, FormControlLabel, Chip, Stack } from '@mui/material';
import experimentService from '../../services/experimentService';

const ModelConfiguration = ({ problemType, dataset, onStartTraining }) => {
    const [algorithm, setAlgorithm] = useState('');
    const [hyperparameters, setHyperparameters] = useState({});
    const [enableTuning, setEnableTuning] = useState(false);
    const [loading, setLoading] = useState(false);

    // algorithms mapping based on problem type
    const getAlgorithms = () => {
        switch (problemType) {
            case 'classification':
                return ['Logistic Regression', 'Random Forest', 'SVM', 'Decision Tree', 'KNN'];
            case 'regression':
                return ['Linear Regression', 'Random Forest Regressor', 'SVR'];
            case 'clustering':
                return ['K-Means', 'DBSCAN', 'Hierarchical'];
            case 'neural_network':
                return ['MLP Classifier', 'MLP Regressor'];
            default:
                return [];
        }
    };

    const handleAlgorithmChange = (e) => {
        setAlgorithm(e.target.value);
        // Reset hyperparameters based on algo defaults (simplified for demo)
        setHyperparameters({});
    };

    const handleTrain = async () => {
        setLoading(true);
        try {
            const experimentData = {
                name: `${algorithm} Experiment - ${new Date().toLocaleTimeString()}`,
                problemType,
                dataset: dataset._id,
                algorithm: algorithm.toLowerCase().replace(/ /g, '_'),
                hyperparameters,
                tuningApplied: enableTuning
            };

            const result = await experimentService.createExperiment(experimentData);
            onStartTraining(result.data); // result.data contains experiment ID to track
        } catch (error) {
            console.error('Training failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Chip label="Step 3" sx={{ bgcolor: 'rgba(61,213,152,0.16)', color: '#f8fbff', borderRadius: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Configure Model</Typography>
                <Chip label={problemType} sx={{ bgcolor: 'rgba(155,107,255,0.14)', color: '#f8fbff', borderRadius: 2 }} />
            </Stack>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Algorithm Selection</Typography>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Algorithm</InputLabel>
                            <Select
                                value={algorithm}
                                label="Algorithm"
                                onChange={handleAlgorithmChange}
                            >
                                {getAlgorithms().map((algo) => (
                                    <MenuItem key={algo} value={algo}>{algo}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={<Switch checked={enableTuning} onChange={(e) => setEnableTuning(e.target.checked)} />}
                            label="Enable Hyperparameter Tuning (Grid Search)"
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Hyperparameters</Typography>
                        {algorithm ? (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {enableTuning ? "Define search space for Grid Search" : "Set fixed parameters"}
                                </Typography>
                                <TextField
                                    label="Custom Params (JSON)"
                                    multiline
                                    rows={6}
                                    fullWidth
                                    placeholder='{"n_estimators": 100, "max_depth": 5}'
                                    onChange={(e) => {
                                        try {
                                            setHyperparameters(JSON.parse(e.target.value));
                                        } catch (err) {
                                            // ignore invalid JSON while typing
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: 'rgba(255,255,255,0.04)',
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Box>
                        ) : (
                            <Typography color="text.secondary">Select an algorithm to configure parameters.</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!algorithm || loading}
                        onClick={handleTrain}
                        sx={{
                            borderRadius: 2,
                            py: 1.4,
                            background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)',
                            boxShadow: '0 16px 40px -18px rgba(155,107,255,0.6)'
                        }}
                    >
                        {loading ? "Initializing Training..." : "Start Training"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ModelConfiguration;
