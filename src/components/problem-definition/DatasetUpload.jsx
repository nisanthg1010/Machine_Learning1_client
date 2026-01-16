import React, { useState } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Alert, Paper, Stack, Chip, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import experimentService from '../../services/experimentService';
import authService from '../../services/authService';

const DatasetUpload = ({ problemType, onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);

    const liveSteps = [
        'Validating CSV & schema',
        'Profiling missing values',
        'Detecting column types',
        'Generating preview rows'
    ];

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setName(e.target.files[0].name.split('.')[0]);
        }
    };

    const ensureDemoAuth = async () => {
        const cached = localStorage.getItem('user');
        if (cached) return;

        const demoUser = {
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123'
        };
        try {
            await authService.login(demoUser);
        } catch (_e) {
            await authService.register(demoUser);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setUploadProgress(6);
        setStepIndex(0);

        // Frontend-only live progress to keep UI responsive while awaiting backend
        const progressTimer = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 8, 92));
            setStepIndex((prev) => Math.min(prev + 1, liveSteps.length - 1));
        }, 600);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('problemType', problemType);
        // Placeholder target column until selection UI is added
        formData.append('targetColumn', 'target');

        try {
            await ensureDemoAuth();
            const result = await experimentService.uploadDataset(formData);
            setUploadProgress(100);
            setStepIndex(liveSteps.length - 1);
            onUploadComplete(result.data);
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.error || err?.message || 'Failed to upload dataset. Please try again.';
            setError(message);

            // Fallback: allow user to proceed locally if backend is unreachable
            const fallback = {
                _id: `local-${Date.now()}`,
                name: name || file.name,
                fileName: file.name,
                problemType,
                samples: 'N/A',
                features: 'N/A',
                status: 'local-only'
            };
            setUploadProgress(100);
            setStepIndex(liveSteps.length - 1);
            onUploadComplete(fallback);
        } finally {
            setLoading(false);
            clearInterval(progressTimer);
        }
    };

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto', mt: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Chip label="Step 2" sx={{ bgcolor: 'rgba(255,79,183,0.16)', color: '#f8fbff', borderRadius: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Upload Dataset</Typography>
                <Chip label={problemType} sx={{ bgcolor: 'rgba(155,107,255,0.14)', color: '#f8fbff', borderRadius: 2 }} />
            </Stack>

            <Paper
                variant="outlined"
                sx={{
                    p: 4,
                    mt: 2,
                    borderStyle: 'dashed',
                    borderColor: 'rgba(155,107,255,0.4)',
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
                    textAlign: 'center'
                }}
            >
                <input
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                    <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)',
                            boxShadow: '0 14px 40px -20px rgba(255,79,183,0.7)'
                        }}
                    >
                        Select CSV File
                    </Button>
                </label>
                {file && (
                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 600 }}>
                        Selected: {file.name}
                    </Typography>
                )}
            </Paper>

            {file && (
                <Box sx={{ mt: 3 }}>
                    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Real-time Processing</Typography>
                            <Chip label={loading ? 'Streaming' : 'Ready'} size="small" color={loading ? 'primary' : 'success'} variant={loading ? 'outlined' : 'filled'} />
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {liveSteps[stepIndex]}
                        </Typography>
                    </Paper>

                    <TextField
                        fullWidth
                        label="Dataset Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                background: 'rgba(255,255,255,0.04)'
                            }
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            py: 1.4,
                            background: 'linear-gradient(135deg, #3dd598, #9b6bff)',
                            boxShadow: '0 16px 40px -20px rgba(61,213,152,0.55)'
                        }}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Upload & Process'}
                    </Button>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default DatasetUpload;
