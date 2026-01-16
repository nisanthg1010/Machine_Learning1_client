import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Slider,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import '../../styles/animations.css';

const PreprocessingPipeline = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [dataState, setDataState] = useState('raw');
    const [sliderValue, setSliderValue] = useState(50);

    // Generate sample data
    const generateRawData = () => {
        return Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            income: 20000 + Math.random() * 150000 + (Math.random() > 0.8 ? Math.random() * 200000 : 0),
            age: 20 + Math.random() * 50 + (Math.random() > 0.9 ? 100 : 0),
            experience: Math.random() * 30,
            education: Math.floor(Math.random() * 5),
        }));
    };

    const [rawData] = useState(generateRawData());

    // Process data through pipeline
    const processedData = {
        raw: rawData,
        cleaned: rawData.filter(d => d.income < 200000 && d.age < 85),
        scaled: rawData.filter(d => d.income < 200000 && d.age < 85).map(d => ({
            ...d,
            income_scaled: (d.income - 20000) / 150000,
            age_scaled: (d.age - 20) / 50,
        })),
        normalized: rawData.filter(d => d.income < 200000 && d.age < 85).map(d => ({
            ...d,
            income_norm: (d.income - 20000) / (170000 - 20000),
            age_norm: (d.age - 20) / (70 - 20),
        })),
    };

    // Visualization data for different processing stages
    const visualizationData = {
        raw: rawData.slice(0, 30).map(d => ({ name: `ID ${d.id}`, income: d.income, age: d.age })),
        cleaned: processedData.cleaned.slice(0, 30).map(d => ({ name: `ID ${d.id}`, income: d.income, age: d.age })),
        scaled: processedData.scaled.slice(0, 30).map((d, i) => ({
            name: i,
            scaled_income: (d.income_scaled * 100).toFixed(1),
            scaled_age: (d.age_scaled * 100).toFixed(1),
        })),
    };

    const steps = [
        {
            id: 1,
            title: 'Raw Data',
            icon: '📥',
            description: 'Original unprocessed data',
            stats: {
                samples: rawData.length,
                outliers: rawData.filter(d => d.income > 200000 || d.age > 85).length,
                missing: 0,
                avg_income: (rawData.reduce((sum, d) => sum + d.income, 0) / rawData.length).toFixed(0),
            },
            issues: [
                '🔴 Outliers present (income > 200K)',
                '🔴 Outliers present (age > 85)',
                '🟡 Features on different scales',
            ],
        },
        {
            id: 2,
            title: 'Outlier Detection & Removal',
            icon: '⚡',
            description: 'Remove anomalous values',
            stats: {
                samples: processedData.cleaned.length,
                outliers: 0,
                missing: 0,
                avg_income: (processedData.cleaned.reduce((sum, d) => sum + d.income, 0) / processedData.cleaned.length).toFixed(0),
            },
            issues: [
                '✅ Outliers removed',
                '✅ No extreme values',
                '🟡 Features still on different scales',
            ],
        },
        {
            id: 3,
            title: 'Scaling (Normalization)',
            icon: '📊',
            description: 'Normalize all features to 0-1 range',
            stats: {
                samples: processedData.scaled.length,
                outliers: 0,
                missing: 0,
                scaled_range: '0.0 - 1.0',
            },
            issues: [
                '✅ Outliers removed',
                '✅ Features normalized',
                '✅ Ready for modeling',
            ],
        },
        {
            id: 4,
            title: 'Feature Engineering',
            icon: '🔨',
            description: 'Create new meaningful features',
            stats: {
                original_features: 4,
                new_features: 2,
                total_features: 6,
                important: 'age, experience, education',
            },
            issues: [
                '✅ Derived age groups',
                '✅ Created experience levels',
                '✅ Enhanced feature set',
            ],
        },
    ];

    const handleOpenDialog = (step) => {
        setSelectedStep(step);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStep(null);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    // Before/After Comparison Chart
    const BeforeAfterChart = ({ beforeData, afterData, title }) => (
        <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                {title}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: '12px', color: '#ff6b6b', fontWeight: 600, mb: 1 }}>
                        ❌ Before
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={beforeData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                            <XAxis dataKey="age" stroke="rgba(255,255,255,0.6)" />
                            <YAxis stroke="rgba(255,255,255,0.6)" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(14, 18, 33, 0.8)',
                                    border: '1px solid rgba(155, 107, 255, 0.3)',
                                }}
                            />
                            <Scatter name="Income" data={beforeData} fill="#ff6b6b" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: '12px', color: '#3dd598', fontWeight: 600, mb: 1 }}>
                        ✅ After
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={afterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                            <XAxis dataKey="age" stroke="rgba(255,255,255,0.6)" />
                            <YAxis stroke="rgba(255,255,255,0.6)" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(14, 18, 33, 0.8)',
                                    border: '1px solid rgba(155, 107, 255, 0.3)',
                                }}
                            />
                            <Scatter name="Income" data={afterData} fill="#3dd598" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );

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
                        Interactive Preprocessing Pipeline
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 400,
                            mb: 3,
                        }}
                    >
                        See how data transforms through each preprocessing step
                    </Typography>
                </Box>
            </motion.div>

            {/* Pipeline Steps */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ marginBottom: '48px' }}
            >
                <Grid container spacing={2} sx={{ mb: 6 }}>
                    {steps.map((step, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={step.id}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    onClick={() => handleOpenDialog(step)}
                                    sx={{
                                        background: 'linear-gradient(145deg, rgba(155, 107, 255, 0.1), rgba(255, 79, 183, 0.05))',
                                        border: '1px solid rgba(155, 107, 255, 0.2)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(14, 18, 33, 0.75)',
                                            borderColor: 'rgba(155, 107, 255, 0.4)',
                                            boxShadow: '0 12px 32px rgba(155, 107, 255, 0.2)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ fontSize: '40px', mb: 1 }}>
                                                {step.icon}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                                                {step.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                                                {step.description}
                                            </Typography>
                                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(155, 107, 255, 0.2)' }}>
                                                {Object.entries(step.stats).map(([key, value]) => (
                                                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', mb: 0.5 }}>
                                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                            {key}:
                                                        </Typography>
                                                        <Typography sx={{ color: '#9b6bff', fontWeight: 600 }}>
                                                            {value}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>

            {/* Before/After Visualizations */}
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
                    <Typography sx={{ fontWeight: 700, mb: 4, fontSize: '20px', color: 'white' }}>
                        Data Transformation Visualization
                    </Typography>

                    <BeforeAfterChart
                        beforeData={visualizationData.raw.map(d => ({ age: d.age, income: d.income }))}
                        afterData={visualizationData.cleaned.map(d => ({ age: d.age, income: d.income }))}
                        title="Outlier Detection & Removal"
                    />

                    {/* Distribution Comparison */}
                    <Box sx={{ mt: 4 }}>
                        <Typography sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                            Feature Distribution Before & After Scaling
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ fontSize: '12px', color: '#ff6b6b', fontWeight: 600, mb: 1 }}>
                                    ❌ Original Scale
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={[
                                            { feature: 'Income', min: 20000, max: 170000, range: 150000 },
                                            { feature: 'Age', min: 20, max: 70, range: 50 },
                                            { feature: 'Experience', min: 0, max: 30, range: 30 },
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                                        <XAxis dataKey="feature" stroke="rgba(255,255,255,0.6)" />
                                        <YAxis stroke="rgba(255,255,255,0.6)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(14, 18, 33, 0.8)',
                                                border: '1px solid rgba(155, 107, 255, 0.3)',
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="range" fill="#ff6b6b" name="Value Range" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ fontSize: '12px', color: '#3dd598', fontWeight: 600, mb: 1 }}>
                                    ✅ After Scaling (0-1)
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={[
                                            { feature: 'Income', min: 0, max: 1, range: 1 },
                                            { feature: 'Age', min: 0, max: 1, range: 1 },
                                            { feature: 'Experience', min: 0, max: 1, range: 1 },
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                                        <XAxis dataKey="feature" stroke="rgba(255,255,255,0.6)" />
                                        <YAxis stroke="rgba(255,255,255,0.6)" />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(14, 18, 33, 0.8)',
                                                border: '1px solid rgba(155, 107, 255, 0.3)',
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="range" fill="#3dd598" name="Normalized Range" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </motion.div>

            {/* Interactive Demo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(61, 213, 152, 0.1), rgba(155, 107, 255, 0.05))',
                        border: '1px solid rgba(61, 213, 152, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                        🎮 Interactive Scaling Demo
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                        Adjust the slider to see how different scaling methods transform your data
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontWeight: 600, mb: 2, color: '#3dd598' }}>
                            Original Value: ${sliderValue * 1000} salary
                        </Typography>
                        <Slider
                            value={sliderValue}
                            onChange={(e, val) => setSliderValue(val)}
                            min={0}
                            max={100}
                            marks={[
                                { value: 0, label: '$0' },
                                { value: 50, label: '$50K' },
                                { value: 100, label: '$100K+' },
                            ]}
                            sx={{
                                color: '#9b6bff',
                                '& .MuiSlider-track': {
                                    background: 'linear-gradient(90deg, #9b6bff, #ff4fb7)',
                                },
                                '& .MuiSlider-thumb': {
                                    background: '#ff4fb7',
                                    boxShadow: '0 0 0 8px rgba(255, 79, 183, 0.15)',
                                },
                            }}
                        />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                background: 'rgba(155, 107, 255, 0.1)',
                                border: '1px solid rgba(155, 107, 255, 0.3)',
                                borderRadius: '8px',
                                p: 2,
                                textAlign: 'center',
                            }}>
                                <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                                    Original
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#9b6bff', fontSize: '20px' }}>
                                    {sliderValue * 1000}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                background: 'rgba(61, 213, 152, 0.1)',
                                border: '1px solid rgba(61, 213, 152, 0.3)',
                                borderRadius: '8px',
                                p: 2,
                                textAlign: 'center',
                            }}>
                                <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                                    Normalized (0-1)
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#3dd598', fontSize: '20px' }}>
                                    {(sliderValue / 100).toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                background: 'rgba(255, 79, 183, 0.1)',
                                border: '1px solid rgba(255, 79, 183, 0.3)',
                                borderRadius: '8px',
                                p: 2,
                                textAlign: 'center',
                            }}>
                                <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                                    Z-Score
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#ff4fb7', fontSize: '20px' }}>
                                    {((sliderValue - 50) / 20).toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                                background: 'rgba(255, 167, 38, 0.1)',
                                border: '1px solid rgba(255, 167, 38, 0.3)',
                                borderRadius: '8px',
                                p: 2,
                                textAlign: 'center',
                            }}>
                                <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                                    Log Transform
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#ffa726', fontSize: '20px' }}>
                                    {(Math.log(Math.max(sliderValue, 1))).toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>

            {/* Dialog for detailed step info */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(145deg, rgba(155, 107, 255, 0.15), rgba(255, 79, 183, 0.05))',
                        border: '1px solid rgba(155, 107, 255, 0.3)',
                    },
                }}
            >
                <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
                    {selectedStep?.title}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                        {selectedStep?.description}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, mb: 1, color: '#9b6bff' }}>
                        Status:
                    </Typography>
                    {selectedStep?.issues.map((issue, idx) => (
                        <Typography key={idx} sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', mb: 0.5 }}>
                            {issue}
                        </Typography>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: '#9b6bff', fontWeight: 600 }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PreprocessingPipeline;
