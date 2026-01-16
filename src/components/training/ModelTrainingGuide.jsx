import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Button,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Chip,
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../../styles/animations.css';

const ModelTrainingGuide = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingData, setTrainingData] = useState([]);

    // Generate training metrics over epochs
    useEffect(() => {
        if (!isTraining) return;

        const interval = setInterval(() => {
            setTrainingProgress((prev) => {
                if (prev >= 100) {
                    setIsTraining(false);
                    return 100;
                }

                const epoch = Math.floor(prev / 10);
                const newData = {
                    epoch: epoch + 1,
                    train_loss: 2.5 - epoch * 0.15 + Math.random() * 0.1,
                    val_loss: 2.6 - epoch * 0.12 + Math.random() * 0.12,
                    train_acc: 0.4 + epoch * 0.05 + Math.random() * 0.02,
                    val_acc: 0.35 + epoch * 0.045 + Math.random() * 0.025,
                };

                setTrainingData((prev) => [...prev, newData]);
                return prev + 10;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [isTraining]);

    const trainingSteps = [
        {
            label: 'Data Preparation',
            description: 'Load and preprocess the dataset',
            details: [
                'Load training data (X_train, y_train)',
                'Normalize features using StandardScaler',
                'Handle missing values and outliers',
                'Encode categorical variables',
            ],
            icon: '📥',
        },
        {
            label: 'Model Initialization',
            description: 'Create and configure the model',
            details: [
                'Initialize model architecture',
                'Set hyperparameters',
                'Define loss function and optimizer',
                'Configure callbacks (early stopping, checkpointing)',
            ],
            icon: '⚙️',
        },
        {
            label: 'Training Loop',
            description: 'Iteratively train the model',
            details: [
                'Forward pass: compute predictions',
                'Calculate loss on training data',
                'Backward pass: compute gradients',
                'Update weights using optimizer (SGD, Adam, etc.)',
                'Log metrics for monitoring',
            ],
            icon: '🔄',
        },
        {
            label: 'Validation',
            description: 'Monitor performance on validation set',
            details: [
                'Evaluate on validation data',
                'Track validation metrics',
                'Check for overfitting/underfitting',
                'Adjust learning rate if needed',
            ],
            icon: '✅',
        },
        {
            label: 'Testing',
            description: 'Final evaluation on unseen test data',
            details: [
                'Evaluate on test set',
                'Generate confusion matrix',
                'Calculate final metrics',
                'Save best performing model',
            ],
            icon: '🎯',
        },
    ];

    const modelAlgorithms = [
        {
            name: 'Linear Regression',
            formula: 'y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ',
            loss: 'Mean Squared Error (MSE)',
            optimizer: 'Gradient Descent',
            learningRate: 0.01,
            epochs: 100,
            complexity: 'Low',
            bestFor: 'Continuous target, linear relationships',
        },
        {
            name: 'Logistic Regression',
            formula: 'σ(z) = 1 / (1 + e⁻ᶻ)',
            loss: 'Binary Cross-Entropy',
            optimizer: 'Adam',
            learningRate: 0.001,
            epochs: 50,
            complexity: 'Low',
            bestFor: 'Binary classification',
        },
        {
            name: 'Decision Tree',
            formula: 'Gini = 1 - Σ(pᵢ)²',
            loss: 'Gini / Information Gain',
            optimizer: 'Greedy Split',
            learningRate: 'N/A',
            epochs: '1',
            complexity: 'Medium',
            bestFor: 'Non-linear patterns, interpretability',
        },
        {
            name: 'Random Forest',
            formula: 'Ensemble of decision trees',
            loss: 'Voting/Averaging',
            optimizer: 'Parallel Training',
            learningRate: 'N/A',
            epochs: '1',
            complexity: 'High',
            bestFor: 'Complex patterns, feature importance',
        },
        {
            name: 'Neural Network',
            formula: 'y = σ(w⁽ˡ⁾ * σ(w⁽ˡ⁻¹⁾ * ... ))',
            loss: 'Cross-Entropy / MSE',
            optimizer: 'Adam / SGD with momentum',
            learningRate: 0.0001,
            epochs: 200,
            complexity: 'Very High',
            bestFor: 'Complex patterns, images, sequences',
        },
        {
            name: 'Support Vector Machine',
            formula: 'max(2/||w||) subject to constraints',
            loss: 'Hinge Loss',
            optimizer: 'SMO (Sequential Minimal Optimization)',
            learningRate: '0.001-0.1',
            epochs: 'Varies',
            complexity: 'High',
            bestFor: 'High-dimensional data, classification',
        },
    ];

    const hyperparameterEffects = [
        {
            parameter: 'Learning Rate',
            range: '0.0001 - 0.1',
            effect: 'Controls step size in gradient descent',
            tooLow: '⚠️ Very slow convergence',
            tooHigh: '⚠️ Oscillating/diverging loss',
            optimal: '✅ Steady decrease in loss',
        },
        {
            parameter: 'Batch Size',
            range: '1 - Full Dataset',
            effect: 'Number of samples per update',
            tooLow: '⚠️ Noisy gradients, slow convergence',
            tooHigh: '⚠️ High memory, less frequent updates',
            optimal: '✅ 32-256 typical, balances speed & stability',
        },
        {
            parameter: 'Number of Epochs',
            range: '10 - 1000+',
            effect: 'How many times to iterate over data',
            tooLow: '⚠️ Underfitting (high train loss)',
            tooHigh: '⚠️ Overfitting (diverging val loss)',
            optimal: '✅ Use early stopping when val loss plateaus',
        },
        {
            parameter: 'Hidden Units/Layers',
            range: '10 - 1000s',
            effect: 'Model capacity (for neural networks)',
            tooLow: '⚠️ Underfitting',
            tooHigh: '⚠️ Overfitting, long training',
            optimal: '✅ Start small, increase if underfitting',
        },
    ];

    const lossExplanations = [
        {
            name: 'Mean Squared Error (MSE)',
            formula: 'MSE = (1/n) * Σ(yᵢ - ŷᵢ)²',
            use: 'Regression problems',
            properties: 'Penalizes large errors more, differentiable',
            color: '#9b6bff',
        },
        {
            name: 'Cross-Entropy Loss',
            formula: 'L = -Σ(yᵢ * log(ŷᵢ))',
            use: 'Classification problems',
            properties: 'Measures probability distribution similarity',
            color: '#ff4fb7',
        },
        {
            name: 'Hinge Loss',
            formula: 'L = Σ max(0, 1 - yᵢ * ŷᵢ)',
            use: 'Support Vector Machines',
            properties: 'Margin-based, robust to outliers',
            color: '#3dd598',
        },
        {
            name: 'Mean Absolute Error (MAE)',
            formula: 'MAE = (1/n) * Σ|yᵢ - ŷᵢ|',
            use: 'Regression, robust to outliers',
            properties: 'Less sensitive to outliers than MSE',
            color: '#ffa726',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            background: 'linear-gradient(135deg, #9b6bff 0%, #ff4fb7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Model Training Guide
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 400,
                        }}
                    >
                        Understand how machine learning models are trained step by step
                    </Typography>
                </Box>
            </motion.div>

            {/* Training Steps */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ marginBottom: '48px' }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(155, 107, 255, 0.1), rgba(255, 79, 183, 0.05))',
                        border: '1px solid rgba(155, 107, 255, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                        Training Pipeline Steps
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {trainingSteps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel
                                    onClick={() => setActiveStep(index)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {step.label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Current Step Details */}
                    <Box sx={{
                        background: 'rgba(155, 107, 255, 0.08)',
                        border: '1px solid rgba(155, 107, 255, 0.2)',
                        borderRadius: '12px',
                        p: 3,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography sx={{ fontSize: '32px' }}>
                                {trainingSteps[activeStep].icon}
                            </Typography>
                            <Box>
                                <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '18px' }}>
                                    {trainingSteps[activeStep].label}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                                    {trainingSteps[activeStep].description}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ ml: 2 }}>
                            {trainingSteps[activeStep].details.map((detail, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                    <CheckCircleIcon sx={{ fontSize: '16px', color: '#3dd598' }} />
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                                        {detail}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'space-between' }}>
                            <Box>
                                <Button
                                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                                    disabled={activeStep === 0}
                                    variant="outlined"
                                    sx={{
                                        borderColor: 'rgba(155, 107, 255, 0.3)',
                                        color: '#9b6bff',
                                        fontWeight: 600,
                                        '&:disabled': { opacity: 0.5 },
                                    }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setActiveStep(Math.min(trainingSteps.length - 1, activeStep + 1))}
                                    disabled={activeStep === trainingSteps.length - 1}
                                    variant="outlined"
                                    sx={{
                                        borderColor: 'rgba(155, 107, 255, 0.3)',
                                        color: '#9b6bff',
                                        fontWeight: 600,
                                        ml: 1,
                                        '&:disabled': { opacity: 0.5 },
                                    }}
                                >
                                    Next
                                </Button>
                            </Box>
                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', alignSelf: 'center' }}>
                                Step {activeStep + 1} of {trainingSteps.length}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>

            {/* Live Training Simulation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(61, 213, 152, 0.1), rgba(155, 107, 255, 0.05))',
                        border: '1px solid rgba(61, 213, 152, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                        📊 Live Training Simulation
                    </Typography>

                    {/* Training Controls */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center' }}>
                        <Button
                            onClick={() => setIsTraining(!isTraining)}
                            variant="contained"
                            startIcon={isTraining ? <PauseIcon /> : <PlayArrowIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #3dd598 0%, #9b6bff 100%)',
                                fontWeight: 600,
                            }}
                        >
                            {isTraining ? 'Pause' : 'Start Training'}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsTraining(false);
                                setTrainingProgress(0);
                                setTrainingData([]);
                            }}
                            variant="outlined"
                            startIcon={<RestartAltIcon />}
                            sx={{
                                borderColor: 'rgba(155, 107, 255, 0.3)',
                                color: '#9b6bff',
                                fontWeight: 600,
                            }}
                        >
                            Reset
                        </Button>
                        <Typography sx={{ ml: 'auto', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                            Progress: {trainingProgress}%
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={trainingProgress}
                        sx={{
                            height: 8,
                            borderRadius: '4px',
                            background: 'rgba(155, 107, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #3dd598, #9b6bff)',
                                borderRadius: '4px',
                            },
                            mb: 3,
                        }}
                    />

                    {/* Training Metrics Charts */}
                    {trainingData.length > 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ fontWeight: 700, mb: 2, color: 'white', fontSize: '14px' }}>
                                    Loss Curves
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={trainingData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                                        <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.6)" />
                                        <YAxis stroke="rgba(255,255,255,0.6)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(14, 18, 33, 0.8)',
                                                border: '1px solid rgba(155, 107, 255, 0.3)',
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="train_loss" stroke="#ff4fb7" name="Train Loss" />
                                        <Line type="monotone" dataKey="val_loss" stroke="#3dd598" name="Val Loss" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ fontWeight: 700, mb: 2, color: 'white', fontSize: '14px' }}>
                                    Accuracy Curves
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={trainingData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                                        <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.6)" />
                                        <YAxis stroke="rgba(255,255,255,0.6)" domain={[0, 1]} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(14, 18, 33, 0.8)',
                                                border: '1px solid rgba(155, 107, 255, 0.3)',
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="train_acc" stroke="#ff4fb7" name="Train Acc" />
                                        <Line type="monotone" dataKey="val_acc" stroke="#3dd598" name="Val Acc" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    )}

                    {trainingData.length === 0 && !isTraining && (
                        <Alert severity="info" sx={{
                            background: 'rgba(155, 107, 255, 0.1)',
                            borderColor: 'rgba(155, 107, 255, 0.3)',
                            color: '#9b6bff',
                        }}>
                            Click "Start Training" to begin the simulation and watch the metrics update in real-time!
                        </Alert>
                    )}
                </Paper>
            </motion.div>

            {/* Model Algorithms */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(155, 107, 255, 0.1), rgba(255, 79, 183, 0.05))',
                        border: '1px solid rgba(155, 107, 255, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                        Common Algorithms & Configuration
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: 'rgba(155, 107, 255, 0.15)' }}>
                                    <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>Algorithm</TableCell>
                                    <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>Formula/Concept</TableCell>
                                    <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>Loss Function</TableCell>
                                    <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>Learning Rate</TableCell>
                                    <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>Epochs</TableCell>
                                    <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>Best For</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modelAlgorithms.map((algo, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{
                                            '&:hover': { background: 'rgba(155, 107, 255, 0.05)' },
                                            borderBottom: '1px solid rgba(155, 107, 255, 0.1)',
                                        }}
                                    >
                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                                            {algo.name}
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                                            <Box component="code" sx={{
                                                background: 'rgba(0,0,0,0.3)',
                                                p: 0.5,
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                            }}>
                                                {algo.formula}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                                            {algo.loss}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3dd598', fontWeight: 600 }}>
                                            {algo.learningRate}
                                        </TableCell>
                                        <TableCell sx={{ color: '#ff4fb7', fontWeight: 600 }}>
                                            {algo.epochs}
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                                            {algo.bestFor}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </motion.div>

            {/* Loss Functions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(255, 79, 183, 0.1), rgba(155, 107, 255, 0.05))',
                        border: '1px solid rgba(255, 79, 183, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                        Loss Functions Explained
                    </Typography>

                    <Grid container spacing={2}>
                        {lossExplanations.map((loss, idx) => (
                            <Grid item xs={12} sm={6} key={idx}>
                                <Card sx={{
                                    background: `linear-gradient(145deg, rgba(${parseInt(loss.color.slice(1, 3), 16)}, ${parseInt(loss.color.slice(3, 5), 16)}, ${parseInt(loss.color.slice(5, 7), 16)}, 0.1), transparent)`,
                                    border: `1px solid ${loss.color}33`,
                                }}>
                                    <CardContent>
                                        <Typography sx={{ fontWeight: 700, color: loss.color, mb: 1 }}>
                                            {loss.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Formula:
                                        </Typography>
                                        <Box component="code" sx={{
                                            background: 'rgba(0,0,0,0.3)',
                                            p: 1,
                                            borderRadius: '4px',
                                            display: 'block',
                                            fontSize: '11px',
                                            color: '#3dd598',
                                            mb: 1,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}>
                                            {loss.formula}
                                        </Box>
                                        <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                            <strong>Use:</strong> {loss.use}
                                        </Typography>
                                        <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                            <strong>Properties:</strong> {loss.properties}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </motion.div>

            {/* Hyperparameter Effects */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(255, 167, 38, 0.1), rgba(155, 107, 255, 0.05))',
                        border: '1px solid rgba(255, 167, 38, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                        Hyperparameter Tuning Guide
                    </Typography>

                    <Grid container spacing={2}>
                        {hyperparameterEffects.map((param, idx) => (
                            <Grid item xs={12} md={6} key={idx}>
                                <Card sx={{
                                    background: 'linear-gradient(145deg, rgba(255, 167, 38, 0.08), transparent)',
                                    border: '1px solid rgba(255, 167, 38, 0.2)',
                                    p: 2,
                                }}>
                                    <Typography sx={{ fontWeight: 700, color: '#ffa726', mb: 1 }}>
                                        {param.parameter}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                                        Range: <Chip label={param.range} size="small" variant="outlined" />
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                        {param.effect}
                                    </Typography>
                                    <Box sx={{ pl: 1, fontSize: '12px', lineHeight: '1.6' }}>
                                        <Typography sx={{ color: '#ff6b6b', fontSize: '12px', mb: 0.5 }}>
                                            {param.tooLow}
                                        </Typography>
                                        <Typography sx={{ color: '#ff6b6b', fontSize: '12px', mb: 0.5 }}>
                                            {param.tooHigh}
                                        </Typography>
                                        <Typography sx={{ color: '#3dd598', fontSize: '12px' }}>
                                            {param.optimal}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default ModelTrainingGuide;
