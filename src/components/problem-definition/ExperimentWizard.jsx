import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Container, Paper, LinearProgress } from '@mui/material';
import ProblemSelector from './ProblemSelector';
import DatasetUpload from './DatasetUpload';
import ModelConfiguration from '../../components/model-config/ModelConfiguration';
import ResultsVisualization from '../../components/visualization/ResultsVisualization';
import ModelDashboard from '../../components/visualization/ModelDashboard';
import VideoExplanation from '../../components/common/VideoExplanation';
import { useNavigate } from 'react-router-dom';

const steps = ['Define Problem', 'Upload Data', 'Train Models', 'Results'];

const ExperimentWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [problemType, setProblemType] = useState(null);
    const [dataset, setDataset] = useState(null);
    const [experiment, setExperiment] = useState(null);
    const navigate = useNavigate();

    const handleProblemSelect = (type) => {
        setProblemType(type);
        setActiveStep(1);
    };

    const handleUploadComplete = (data) => {
        setDataset(data);
        setActiveStep(2);
    };

    const handleStartTraining = (experimentData) => {
        setExperiment(experimentData);
        setActiveStep(3);
        // In a real app, we'd poll for status here using experimentData._id
    };

    const handleReset = () => {
        setActiveStep(0);
        setProblemType(null);
        setDataset(null);
        setExperiment(null);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, rgba(16,21,38,0.92), rgba(10,15,28,0.92))',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    Guided Experiment Wizard
                </Typography>
                <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / steps.length) * 100}
                    sx={{ mb: 3, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.05)' }}
                />

                <Box>
                    {activeStep === 0 && (
                        <ProblemSelector onSelect={handleProblemSelect} />
                    )}

                    {activeStep === 1 && (
                        <DatasetUpload
                            problemType={problemType}
                            onUploadComplete={handleUploadComplete}
                        />
                    )}

                    {activeStep === 2 && dataset && (
                        <ModelDashboard
                            datasetId={dataset._id}
                            problemType={problemType}
                            onTrainingComplete={handleStartTraining}
                        />
                    )}

                    {activeStep === 3 && (
                        <Box>
                            {experiment ? (
                                <>
                                    <ResultsVisualization 
                                        metrics={experiment.testMetrics}
                                        trainedModels={experiment.trainedModels || []}
                                        bestModel={experiment.bestModel}
                                    />
                                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                                        <Button onClick={handleReset} sx={{ mr: 2 }}>Start New Experiment</Button>
                                        <Button variant="contained" onClick={() => navigate('/dashboard')}>
                                            Go to Dashboard
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', mt: 4 }}>
                                    <VideoExplanation />
                                    <Typography sx={{ mt: 2 }}>Training in progress...</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ExperimentWizard;
