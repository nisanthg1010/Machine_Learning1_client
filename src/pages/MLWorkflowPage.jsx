import React, { useState, useContext } from 'react';
import { Box, Container, Stepper, Step, StepLabel, Paper, Typography, Button, Grid, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Slider, Stack, Chip, Switch, FormControlLabel, Checkbox, FormGroup, LinearProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tabs, Tab } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from 'recharts';
import { AuthContext, ModelContext } from '../App';

const MLWorkflowPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { setLatestModel } = useContext(ModelContext);

    // Workflow steps
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Dataset', 'Configure Split', 'Preprocessing', 'Algorithm', 'Hyperparameters', 'Train', 'Results'];

    // Step 1: Dataset
    const [file, setFile] = useState(null);
    const [datasetInfo, setDatasetInfo] = useState(null);
    const [targetColumn, setTargetColumn] = useState('');

    // Step 2: Train/Test Split
    const [trainSize, setTrainSize] = useState(80);
    const [validationSize, setValidationSize] = useState(0);
    const [shuffleData, setShuffleData] = useState(true);

    // Step 3: Preprocessing
    const [preprocessing, setPreprocessing] = useState({
        handleMissing: 'mean',
        removeOutliers: false,
        scaling: 'standard',
        encoding: 'onehot',
        dataAugmentation: false
    });

    // Step 4: Algorithm Selection
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

    // Step 5: Hyperparameters
    const [hyperparameters, setHyperparameters] = useState({});
    const [useGridSearch, setUseGridSearch] = useState(false);

    // Step 6: Training
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingLog, setTrainingLog] = useState([]);

    // Step 7: Results
    const [results, setResults] = useState(null);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [selectedAlgoInfo, setSelectedAlgoInfo] = useState(null);
    const [resultsTab, setResultsTab] = useState(0);

    // Video explanations for each algorithm
    const algorithmVideos = {
        'Logistic Regression': { url: 'https://www.youtube.com/embed/yIYKR4sgzI8', title: 'Logistic Regression Explained', description: 'Classification algorithm using sigmoid function' },
        'Linear Regression': { url: 'https://www.youtube.com/embed/7ArmBVF2dCs', title: 'Linear Regression Tutorial', description: 'Predicting continuous values with linear relationships' },
        'Decision Tree': { url: 'https://www.youtube.com/embed/ZVR2Way4nwQ', title: 'Decision Trees Explained', description: 'Tree-based model for classification and regression' },
        'Random Forest': { url: 'https://www.youtube.com/embed/J4Wdy0Wc_xQ', title: 'Random Forest Algorithm', description: 'Ensemble of decision trees for better accuracy' },
        'SVM': { url: 'https://www.youtube.com/embed/efR1C6CvhmE', title: 'Support Vector Machines', description: 'Maximum margin classifier for complex boundaries' },
        'KNN': { url: 'https://www.youtube.com/embed/HVXime0nQeI', title: 'K-Nearest Neighbors', description: 'Instance-based learning using proximity' },
        'Naive Bayes': { url: 'https://www.youtube.com/embed/O2L2Uv9pdDA', title: 'Naive Bayes Classifier', description: 'Probabilistic classifier based on Bayes theorem' },
        'K-Means': { url: 'https://www.youtube.com/embed/4b5d3muPQmA', title: 'K-Means Clustering', description: 'Partitioning data into K distinct clusters' },
        'DBSCAN': { url: 'https://www.youtube.com/embed/RDZUdRSDOok', title: 'DBSCAN Algorithm', description: 'Density-based spatial clustering' },
        'PCA': { url: 'https://www.youtube.com/embed/FgakZw6K1QQ', title: 'Principal Component Analysis', description: 'Dimensionality reduction technique' },
        'ANN': { url: 'https://www.youtube.com/embed/aircAruvnKk', title: 'Neural Networks', description: 'Artificial neural networks for deep learning' },
        'CNN': { url: 'https://www.youtube.com/embed/YRhxdVk_sIs', title: 'Convolutional Neural Networks', description: 'Deep learning for image recognition' },
        'RNN': { url: 'https://www.youtube.com/embed/LHXXI4-IEns', title: 'Recurrent Neural Networks', description: 'Sequential data processing with memory' },
        'LSTM': { url: 'https://www.youtube.com/embed/8HyCNIVRbSU', title: 'Long Short-Term Memory', description: 'Advanced RNN for long sequences' }
    };

    // Algorithm configurations by category
    const algorithms = {
        supervised: {
            classification: ['Logistic Regression', 'Decision Tree', 'Random Forest', 'SVM', 'KNN', 'Naive Bayes', 'Gradient Boosting'],
            regression: ['Linear Regression', 'Ridge', 'Lasso', 'Decision Tree Regressor', 'Random Forest Regressor', 'SVR']
        },
        unsupervised: ['K-Means', 'Hierarchical Clustering', 'DBSCAN', 'Gaussian Mixture', 'PCA'],
        reinforcement: ['Q-Learning', 'Deep Q-Network (DQN)', 'Policy Gradient', 'Actor-Critic', 'PPO'],
        neural: ['ANN', 'CNN', 'RNN', 'LSTM', 'Autoencoder', 'GAN']
    };

    // Get category details
    const categoryDetails = {
        supervised: { title: 'Supervised Learning', color: '#9b6bff', icon: '📊' },
        unsupervised: { title: 'Unsupervised Learning', color: '#3dd598', icon: '🎯' },
        reinforcement: { title: 'Reinforcement Learning', color: '#ff4fb7', icon: '🎮' },
        neural: { title: 'Neural Networks', color: '#ffa726', icon: '🧠' }
    };

    const details = categoryDetails[category] || categoryDetails.supervised;

    // Handler functions
    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            // Simulate dataset analysis
            setDatasetInfo({
                name: uploadedFile.name,
                rows: Math.floor(Math.random() * 10000) + 1000,
                columns: Math.floor(Math.random() * 20) + 5,
                features: ['Feature_1', 'Feature_2', 'Feature_3', 'Feature_4', 'Feature_5', 'Target'],
                size: (uploadedFile.size / 1024).toFixed(2) + ' KB'
            });
        }
    };

    const handleNext = () => {
        if (activeStep === 5) {
            // Start training
            handleTraining();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleTraining = async () => {
        setIsTraining(true);
        setTrainingProgress(0);
        setTrainingLog([]);

        // Simulate training with real-time updates
        const logs = [
            'Loading dataset...',
            'Splitting data: ' + trainSize + '% train, ' + (100 - trainSize) + '% test',
            'Applying preprocessing...',
            'Initializing ' + selectedAlgorithm + '...',
            'Training model...',
            'Epoch 1/10 - Loss: 0.543',
            'Epoch 5/10 - Loss: 0.234',
            'Epoch 10/10 - Loss: 0.112',
            'Evaluating on test set...',
            'Training complete!'
        ];

        for (let i = 0; i < logs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setTrainingLog(prev => [...prev, logs[i]]);
            setTrainingProgress(((i + 1) / logs.length) * 100);
        }

        // Generate mock results
        const mockResults = {
            accuracy: (Math.random() * 0.15 + 0.85).toFixed(3),
            precision: (Math.random() * 0.15 + 0.82).toFixed(3),
            recall: (Math.random() * 0.15 + 0.84).toFixed(3),
            f1Score: (Math.random() * 0.15 + 0.83).toFixed(3),
            trainingTime: (Math.random() * 5 + 2).toFixed(2) + 's',
            confusionMatrix: [[850, 45], [30, 875]],
            lossHistory: Array.from({ length: 10 }, (_, i) => ({
                epoch: i + 1,
                loss: 0.6 - (i * 0.05) + (Math.random() * 0.05)
            })),
            accuracyHistory: Array.from({ length: 10 }, (_, i) => ({
                epoch: i + 1,
                train: 0.7 + (i * 0.025) + (Math.random() * 0.02),
                test: 0.68 + (i * 0.022) + (Math.random() * 0.02)
            })),
            featureImportance: [
                { feature: 'Feature 1', importance: 0.35 },
                { feature: 'Feature 2', importance: 0.28 },
                { feature: 'Feature 3', importance: 0.18 },
                { feature: 'Feature 4', importance: 0.12 },
                { feature: 'Feature 5', importance: 0.07 }
            ],
            rocCurve: Array.from({ length: 20 }, (_, i) => ({
                fpr: i / 20,
                tpr: Math.min(1, (i / 20) + 0.1 + (Math.random() * 0.15))
            })),
            classDistribution: [
                { name: 'Class 0', value: 920, color: '#9b6bff' },
                { name: 'Class 1', value: 880, color: '#3dd598' }
            ],
            performanceRadar: [
                { metric: 'Accuracy', value: 92 },
                { metric: 'Precision', value: 89 },
                { metric: 'Recall', value: 91 },
                { metric: 'F1-Score', value: 90 },
                { metric: 'Specificity', value: 88 }
            ],
            learningCurve: Array.from({ length: 10 }, (_, i) => ({
                samples: (i + 1) * 100,
                trainScore: 0.75 + (i * 0.02) - (Math.random() * 0.03),
                cvScore: 0.72 + (i * 0.018) - (Math.random() * 0.03)
            }))
        };

        setResults(mockResults);

        // Update sidebar with latest model
        if (setLatestModel) {
            setLatestModel({
                modelName: selectedAlgorithm,
                dataset: datasetInfo?.name || 'Unknown',
                accuracy: (parseFloat(mockResults.accuracy) * 100).toFixed(2) + '%',
                precision: (parseFloat(mockResults.precision) * 100).toFixed(2) + '%',
                recall: (parseFloat(mockResults.recall) * 100).toFixed(2) + '%',
                f1Score: (parseFloat(mockResults.f1Score) * 100).toFixed(2) + '%',
                features: datasetInfo?.columns || 'Unknown',
                trainingTime: mockResults.trainingTime,
                samples: datasetInfo?.rows || 'Unknown',
                status: '✅ Ready',
                timestamp: new Date().toISOString()
            });
        }

        setIsTraining(false);
        setActiveStep(6);
    };

    // Render step content
    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Upload Dataset</Typography>
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                border: '2px dashed rgba(155, 107, 255, 0.4)',
                                background: 'rgba(155, 107, 255, 0.05)',
                                borderRadius: 2
                            }}
                        >
                            <input
                                accept=".csv"
                                style={{ display: 'none' }}
                                id="dataset-upload"
                                type="file"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="dataset-upload">
                                <Button
                                    component="span"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ background: `linear-gradient(135deg, ${details.color}, ${details.color}dd)` }}
                                >
                                    Select CSV File
                                </Button>
                            </label>
                            {file && (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    File selected: {file.name}
                                </Alert>
                            )}
                        </Paper>

                        {datasetInfo && (
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>Dataset Information</Typography>
                                            <Stack spacing={1}>
                                                <Typography variant="body2">📄 Name: {datasetInfo.name}</Typography>
                                                <Typography variant="body2">📊 Rows: {datasetInfo.rows}</Typography>
                                                <Typography variant="body2">📈 Columns: {datasetInfo.columns}</Typography>
                                                <Typography variant="body2">💾 Size: {datasetInfo.size}</Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {category === 'supervised' && (
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <FormControl fullWidth>
                                                    <InputLabel>Select Target Column</InputLabel>
                                                    <Select
                                                        value={targetColumn}
                                                        onChange={(e) => setTargetColumn(e.target.value)}
                                                        label="Select Target Column"
                                                    >
                                                        {datasetInfo.features.map(feature => (
                                                            <MenuItem key={feature} value={feature}>{feature}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Configure Data Split</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom>Training Size: {trainSize}%</Typography>
                                        <Slider
                                            value={trainSize}
                                            onChange={(e, val) => setTrainSize(val)}
                                            min={50}
                                            max={90}
                                            valueLabelDisplay="auto"
                                            sx={{ color: details.color }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            Testing Size: {100 - trainSize - validationSize}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom>Validation Size: {validationSize}%</Typography>
                                        <Slider
                                            value={validationSize}
                                            onChange={(e, val) => setValidationSize(val)}
                                            min={0}
                                            max={20}
                                            valueLabelDisplay="auto"
                                            sx={{ color: details.color }}
                                        />
                                        <FormControlLabel
                                            control={<Switch checked={shuffleData} onChange={(e) => setShuffleData(e.target.checked)} />}
                                            label="Shuffle data before split"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Preprocessing Options</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel>Handle Missing Values</InputLabel>
                                            <Select
                                                value={preprocessing.handleMissing}
                                                onChange={(e) => setPreprocessing({ ...preprocessing, handleMissing: e.target.value })}
                                                label="Handle Missing Values"
                                            >
                                                <MenuItem value="mean">Fill with Mean</MenuItem>
                                                <MenuItem value="median">Fill with Median</MenuItem>
                                                <MenuItem value="mode">Fill with Mode</MenuItem>
                                                <MenuItem value="drop">Drop Rows</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel>Feature Scaling</InputLabel>
                                            <Select
                                                value={preprocessing.scaling}
                                                onChange={(e) => setPreprocessing({ ...preprocessing, scaling: e.target.value })}
                                                label="Feature Scaling"
                                            >
                                                <MenuItem value="none">None</MenuItem>
                                                <MenuItem value="standard">Standard Scaler</MenuItem>
                                                <MenuItem value="minmax">Min-Max Scaler</MenuItem>
                                                <MenuItem value="robust">Robust Scaler</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel>Categorical Encoding</InputLabel>
                                            <Select
                                                value={preprocessing.encoding}
                                                onChange={(e) => setPreprocessing({ ...preprocessing, encoding: e.target.value })}
                                                label="Categorical Encoding"
                                            >
                                                <MenuItem value="onehot">One-Hot Encoding</MenuItem>
                                                <MenuItem value="label">Label Encoding</MenuItem>
                                                <MenuItem value="ordinal">Ordinal Encoding</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={preprocessing.removeOutliers}
                                                    onChange={(e) => setPreprocessing({ ...preprocessing, removeOutliers: e.target.checked })}
                                                />
                                            }
                                            label="Remove Outliers (IQR method)"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={preprocessing.dataAugmentation}
                                                    onChange={(e) => setPreprocessing({ ...preprocessing, dataAugmentation: e.target.checked })}
                                                />
                                            }
                                            label="Enable Data Augmentation"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Select Algorithm</Typography>
                        <Grid container spacing={2}>
                            {(category === 'supervised' ? [...algorithms.supervised.classification, ...algorithms.supervised.regression] : algorithms[category])?.map((algo) => (
                                <Grid item xs={12} sm={6} md={4} key={algo}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: selectedAlgorithm === algo ? `2px solid ${details.color}` : '1px solid rgba(255,255,255,0.1)',
                                            background: selectedAlgorithm === algo ? `${details.color}15` : 'transparent',
                                            '&:hover': { border: `2px solid ${details.color}80` }
                                        }}
                                        onClick={() => setSelectedAlgorithm(algo)}
                                    >
                                        <CardContent>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    {selectedAlgorithm === algo && <CheckCircleIcon sx={{ color: details.color }} />}
                                                    <Typography variant="h6">{algo}</Typography>
                                                </Stack>
                                                {algorithmVideos[algo] && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedAlgoInfo(algorithmVideos[algo]);
                                                            setVideoDialogOpen(true);
                                                        }}
                                                        sx={{ color: details.color }}
                                                    >
                                                        <PlayCircleOutlineIcon />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                            {algorithmVideos[algo] && (
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                    {algorithmVideos[algo].description}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                );

            case 4:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Hyperparameter Tuning</Typography>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <FormControlLabel
                                    control={<Switch checked={useGridSearch} onChange={(e) => setUseGridSearch(e.target.checked)} />}
                                    label="Enable Grid Search with Cross-Validation"
                                />
                            </CardContent>
                        </Card>

                        {!useGridSearch && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <TextField
                                                fullWidth
                                                label="Learning Rate"
                                                type="number"
                                                defaultValue={0.01}
                                                inputProps={{ step: 0.001, min: 0.0001, max: 1 }}
                                                sx={{ mb: 2 }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Max Iterations"
                                                type="number"
                                                defaultValue={1000}
                                                inputProps={{ step: 100, min: 100, max: 10000 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <TextField
                                                fullWidth
                                                label="Random State"
                                                type="number"
                                                defaultValue={42}
                                                sx={{ mb: 2 }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Regularization (Alpha)"
                                                type="number"
                                                defaultValue={1.0}
                                                inputProps={{ step: 0.1, min: 0, max: 10 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                );

            case 5:
                return (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Ready to Train</Typography>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Training Configuration Summary</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Category:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="body2">{details.title}</Typography></Grid>

                                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Dataset:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="body2">{datasetInfo?.name}</Typography></Grid>

                                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Algorithm:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="body2">{selectedAlgorithm}</Typography></Grid>

                                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Train/Test Split:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="body2">{trainSize}% / {100 - trainSize}%</Typography></Grid>

                                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Scaling:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="body2">{preprocessing.scaling}</Typography></Grid>

                                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Grid Search:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="body2">{useGridSearch ? 'Enabled' : 'Disabled'}</Typography></Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                );

            case 6:
                return (
                    <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Training Results</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<PlayCircleOutlineIcon />}
                                onClick={() => {
                                    if (algorithmVideos[selectedAlgorithm]) {
                                        setSelectedAlgoInfo(algorithmVideos[selectedAlgorithm]);
                                        setVideoDialogOpen(true);
                                    }
                                }}
                                sx={{ borderColor: details.color, color: details.color }}
                            >
                                Watch Tutorial
                            </Button>
                        </Stack>
                        {results && (
                            <>
                                <Tabs value={resultsTab} onChange={(e, val) => setResultsTab(val)} sx={{ mb: 3 }}>
                                    <Tab label="Performance Metrics" />
                                    <Tab label="Visualizations" />
                                    <Tab label="Advanced Analysis" />
                                </Tabs>

                                {resultsTab === 0 && (
                                    <>
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={6} sm={3}>
                                                <Card sx={{ background: `linear-gradient(135deg, ${details.color}20, transparent)` }}>
                                                    <CardContent sx={{ textAlign: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">Accuracy</Typography>
                                                        <Typography variant="h4" sx={{ color: details.color, fontWeight: 800 }}>{(results.accuracy * 100).toFixed(1)}%</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Card sx={{ background: 'linear-gradient(135deg, rgba(61,213,152,0.2), transparent)' }}>
                                                    <CardContent sx={{ textAlign: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">Precision</Typography>
                                                        <Typography variant="h4" sx={{ color: '#3dd598', fontWeight: 800 }}>{(results.precision * 100).toFixed(1)}%</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Card sx={{ background: 'linear-gradient(135deg, rgba(255,79,183,0.2), transparent)' }}>
                                                    <CardContent sx={{ textAlign: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">Recall</Typography>
                                                        <Typography variant="h4" sx={{ color: '#ff4fb7', fontWeight: 800 }}>{(results.recall * 100).toFixed(1)}%</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Card sx={{ background: 'linear-gradient(135deg, rgba(255,167,38,0.2), transparent)' }}>
                                                    <CardContent sx={{ textAlign: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">F1-Score</Typography>
                                                        <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 800 }}>{(results.f1Score * 100).toFixed(1)}%</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom>📉 Training Loss</Typography>
                                                        <ResponsiveContainer width="100%" height={280}>
                                                            <AreaChart data={results.lossHistory}>
                                                                <defs>
                                                                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="5%" stopColor={details.color} stopOpacity={0.8}/>
                                                                        <stop offset="95%" stopColor={details.color} stopOpacity={0}/>
                                                                    </linearGradient>
                                                                </defs>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                                <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.5)" />
                                                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                                                <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                                <Area type="monotone" dataKey="loss" stroke={details.color} fillOpacity={1} fill="url(#colorLoss)" />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom>📈 Accuracy Progress</Typography>
                                                        <ResponsiveContainer width="100%" height={280}>
                                                            <LineChart data={results.accuracyHistory}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                                <XAxis dataKey="epoch" stroke="rgba(255,255,255,0.5)" />
                                                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                                                <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                                <Legend />
                                                                <Line type="monotone" dataKey="train" stroke="#9b6bff" strokeWidth={3} name="Training" />
                                                                <Line type="monotone" dataKey="test" stroke="#3dd598" strokeWidth={3} name="Testing" />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}

                                {resultsTab === 1 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>🎯 Feature Importance</Typography>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <BarChart data={results.featureImportance} layout="vertical">
                                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                            <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                                                            <YAxis dataKey="feature" type="category" stroke="rgba(255,255,255,0.5)" />
                                                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                            <Bar dataKey="importance" fill={details.color} radius={[0, 8, 8, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>📊 Class Distribution</Typography>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={results.classDistribution}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={100}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                            >
                                                                {results.classDistribution.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>🔍 ROC Curve</Typography>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={results.rocCurve}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                            <XAxis dataKey="fpr" stroke="rgba(255,255,255,0.5)" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }} />
                                                            <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                                                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                            <Line type="monotone" dataKey="tpr" stroke="#ff4fb7" strokeWidth={3} dot={false} />
                                                            <Line type="monotone" data={[{fpr: 0, tpr: 0}, {fpr: 1, tpr: 1}]} dataKey="tpr" stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5" dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                                        AUC Score: 0.94
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>🎛️ Performance Radar</Typography>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <RadarChart data={results.performanceRadar}>
                                                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                                                            <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
                                                            <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                                                            <Radar name="Performance" dataKey="value" stroke={details.color} fill={details.color} fillOpacity={0.6} />
                                                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                )}

                                {resultsTab === 2 && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>📚 Learning Curve Analysis</Typography>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={results.learningCurve}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                            <XAxis dataKey="samples" stroke="rgba(255,255,255,0.5)" label={{ value: 'Training Samples', position: 'insideBottom', offset: -5 }} />
                                                            <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                                                            <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                            <Legend />
                                                            <Line type="monotone" dataKey="trainScore" stroke="#9b6bff" strokeWidth={2} name="Training Score" />
                                                            <Line type="monotone" dataKey="cvScore" stroke="#3dd598" strokeWidth={2} name="Cross-Validation Score" />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                    <Alert severity="info" sx={{ mt: 2 }}>
                                                        <Typography variant="body2">
                                                            <strong>Interpretation:</strong> The learning curve shows how model performance improves with more training data. 
                                                            A converging gap between training and CV scores indicates good generalization.
                                                        </Typography>
                                                    </Alert>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>🔢 Confusion Matrix</Typography>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell></TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Predicted 0</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Predicted 1</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: 700 }}>Actual 0</TableCell>
                                                                    <TableCell align="center" sx={{ background: '#3dd59820', fontSize: '1.2rem', fontWeight: 700 }}>{results.confusionMatrix[0][0]}</TableCell>
                                                                    <TableCell align="center" sx={{ background: '#ff4fb720', fontSize: '1.2rem' }}>{results.confusionMatrix[0][1]}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: 700 }}>Actual 1</TableCell>
                                                                    <TableCell align="center" sx={{ background: '#ff4fb720', fontSize: '1.2rem' }}>{results.confusionMatrix[1][0]}</TableCell>
                                                                    <TableCell align="center" sx={{ background: '#3dd59820', fontSize: '1.2rem', fontWeight: 700 }}>{results.confusionMatrix[1][1]}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>📋 Model Summary</Typography>
                                                    <Stack spacing={1.5}>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Algorithm</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedAlgorithm}</Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Training Time</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{results.trainingTime}</Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Dataset</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{datasetInfo?.name}</Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">Train/Test Split</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{trainSize}% / {100 - trainSize}%</Typography>
                                                        </Box>
                                                        <Divider />
                                                        <Button
                                                            variant="outlined"
                                                            fullWidth
                                                            startIcon={<InfoIcon />}
                                                            onClick={() => {
                                                                if (algorithmVideos[selectedAlgorithm]) {
                                                                    setSelectedAlgoInfo(algorithmVideos[selectedAlgorithm]);
                                                                    setVideoDialogOpen(true);
                                                                }
                                                            }}
                                                            sx={{ borderColor: details.color, color: details.color }}
                                                        >
                                                            Learn More About {selectedAlgorithm}
                                                        </Button>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${details.color}15, transparent)`, border: `1px solid ${details.color}30` }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h3">{details.icon}</Typography>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{details.title}</Typography>
                            <Typography variant="body2" color="text.secondary">Complete workflow from data to deployment</Typography>
                        </Box>
                    </Stack>
                    <Button variant="outlined" onClick={() => navigate('/categories')}>← Back to Categories</Button>
                </Stack>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Paper sx={{ p: 3, minHeight: 400 }}>
                {activeStep === 5 && isTraining ? (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Training in Progress...</Typography>
                        <LinearProgress variant="determinate" value={trainingProgress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
                        <Typography variant="body2" sx={{ mb: 2 }}>Progress: {trainingProgress.toFixed(0)}%</Typography>
                        <Card sx={{ background: 'rgba(0,0,0,0.3)', maxHeight: 300, overflow: 'auto' }}>
                            <CardContent>
                                {trainingLog.map((log, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                                        {log}
                                    </Typography>
                                ))}
                            </CardContent>
                        </Card>
                    </Box>
                ) : (
                    renderStepContent()
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                            (activeStep === 0 && !datasetInfo) ||
                            (activeStep === 3 && !selectedAlgorithm) ||
                            isTraining
                        }
                        startIcon={activeStep === 5 ? <PlayArrowIcon /> : null}
                        sx={{ background: `linear-gradient(135deg, ${details.color}, ${details.color}dd)` }}
                    >
                        {activeStep === 5 ? 'Start Training' : activeStep === 6 ? 'Complete' : 'Next'}
                    </Button>
                </Stack>
            </Paper>

            {/* Video Tutorial Dialog */}
            <Dialog
                open={videoDialogOpen}
                onClose={() => setVideoDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{selectedAlgoInfo?.title}</Typography>
                        <IconButton onClick={() => setVideoDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    {selectedAlgoInfo && (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {selectedAlgoInfo.description}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'relative',
                                    paddingBottom: '56.25%',
                                    height: 0,
                                    overflow: 'hidden',
                                    borderRadius: 2
                                }}
                            >
                                <iframe
                                    src={selectedAlgoInfo.url}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 'none'
                                    }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={selectedAlgoInfo.title}
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setVideoDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MLWorkflowPage;
