import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Alert,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    CheckCircle as CheckCircleIcon,
    PlayArrow as PlayArrowIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
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
import '../../styles/animations.css';

const PreprocessingTechniques = () => {
    const [expandedStep, setExpandedStep] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);

    // Sample data for visualizations
    const missingDataExample = [
        { id: 1, salary: 50000, years: 3 },
        { id: 2, salary: null, years: 5 },
        { id: 3, salary: 65000, years: 4 },
        { id: 4, salary: null, years: 6 },
        { id: 5, salary: 75000, years: 7 },
    ];

    const scalingData = [
        { name: 'Original', value: 5000, normalized: 0.2, standardized: -0.8 },
        { name: 'Original', value: 15000, normalized: 0.6, standardized: 0.4 },
        { name: 'Original', value: 25000, normalized: 1.0, standardized: 1.6 },
    ];

    const normalizationComparison = [
        { range: 'Min-Max\n(0-1)', formula: '(X - Min) / (Max - Min)', useCase: 'Bounded features, Neural Networks', color: '#9b6bff' },
        { range: 'Z-Score\n(Std)', formula: '(X - Mean) / Std Dev', useCase: 'Unbounded features, Linear Models', color: '#ff4fb7' },
        { range: 'Log\nTransform', formula: 'log(X)', useCase: 'Skewed distributions', color: '#3dd598' },
    ];

    const encodingTechniques = [
        {
            name: 'One-Hot Encoding',
            description: 'Converts categorical into binary columns',
            example: {
                input: ['Red', 'Green', 'Blue', 'Red'],
                output: 'Red=[1,0,0], Green=[0,1,0], Blue=[0,0,1]'
            },
            pros: ['Works well with tree models', 'No ordinal assumption'],
            cons: ['Creates many columns', 'Curse of dimensionality'],
            bestFor: ['Decision Trees', 'Random Forest', 'Neural Networks']
        },
        {
            name: 'Label Encoding',
            description: 'Maps categories to integers (0, 1, 2...)',
            example: {
                input: ['Small', 'Medium', 'Large'],
                output: '[0, 1, 2]'
            },
            pros: ['Memory efficient', 'Fast computation'],
            cons: ['Assumes ordinal relationship', 'Not ideal for unordered categories'],
            bestFor: ['Tree-based models', 'Low memory environments']
        },
        {
            name: 'Target Encoding',
            description: 'Encodes categories by their target mean',
            example: {
                input: 'Category -> Mean Target Value',
                output: 'Replace category with its average target'
            },
            pros: ['Captures target information', 'Reduces dimensionality'],
            cons: ['Risk of overfitting', 'Requires careful cross-validation'],
            bestFor: ['Linear models', 'Complex categories']
        },
    ];

    const imbalanceHandling = [
        {
            name: 'Oversampling',
            description: 'Increase minority class samples',
            visualization: 'Duplicate minority class or use SMOTE',
            pros: 'No information loss',
            cons: 'Risk of overfitting',
        },
        {
            name: 'Undersampling',
            description: 'Reduce majority class samples',
            visualization: 'Randomly remove majority class',
            pros: 'Faster training',
            cons: 'Information loss',
        },
        {
            name: 'SMOTE',
            description: 'Synthetic Minority Over-sampling Technique',
            visualization: 'Create synthetic samples between minority points',
            pros: 'Balanced + no overfitting',
            cons: 'Computational cost',
        },
    ];

    const techniques = [
        {
            id: 1,
            title: 'Handling Missing Values',
            icon: '❌',
            description: 'Strategies for dealing with NULL or NaN values',
            details: [
                'Identify missing patterns and mechanisms',
                'Visualize missing data heatmaps',
                'Choose strategy based on missingness %',
                'Document handling method for reproducibility',
            ],
            methods: [
                {
                    name: 'Deletion',
                    impact: 'High',
                    useWhen: 'Missing < 5% of data',
                    formula: 'Remove rows or columns with NaN',
                    code: 'df.dropna()',
                    pros: 'Simple, no bias introduction',
                    cons: 'Loss of data',
                },
                {
                    name: 'Mean/Median Imputation',
                    impact: 'Medium',
                    useWhen: 'Random missing, < 20%',
                    formula: 'Replace with mean (numeric) or mode (categorical)',
                    code: 'df.fillna(df.mean())',
                    pros: 'Preserves data size, easy',
                    cons: 'Reduces variance, may introduce bias',
                },
                {
                    name: 'Forward/Backward Fill',
                    impact: 'Low',
                    useWhen: 'Time-series data',
                    formula: 'Fill with previous/next value',
                    code: 'df.fillna(method="ffill")',
                    pros: 'Respects temporal order',
                    cons: 'Only for time series',
                },
                {
                    name: 'KNN Imputation',
                    impact: 'Low',
                    useWhen: 'Complex patterns, < 30%',
                    formula: 'Use k nearest neighbors\' values',
                    code: 'KNNImputer(n_neighbors=5)',
                    pros: 'Sophisticated, multivariate',
                    cons: 'Computationally expensive',
                },
            ],
            visualization: missingDataExample,
            chartType: 'missing',
        },
        {
            id: 2,
            title: 'Feature Scaling & Normalization',
            icon: '📊',
            description: 'Bring features to similar scales for fair comparison',
            details: [
                'Understand why scaling matters for different algorithms',
                'Compare different scaling methods',
                'Apply appropriate scaling per feature type',
                'Handle outliers before scaling',
            ],
            methods: normalizationComparison,
            visualization: scalingData,
            chartType: 'scaling',
        },
        {
            id: 3,
            title: 'Categorical Encoding',
            icon: '🏷️',
            description: 'Convert categorical variables to numeric format',
            details: [
                'Identify categorical vs numerical features',
                'Choose encoding based on cardinality and data type',
                'Handle new categories in production',
                'Validate encoded output distribution',
            ],
            methods: encodingTechniques,
            chartType: 'encoding',
        },
        {
            id: 4,
            title: 'Outlier Detection & Handling',
            icon: '⚡',
            description: 'Identify and handle anomalous values',
            details: [
                'Use IQR (Interquartile Range) method',
                'Apply Z-score for normally distributed data',
                'Use Isolation Forest for multivariate outliers',
                'Document outlier removal strategy',
            ],
            methods: [
                {
                    name: 'IQR Method',
                    formula: 'Outliers: X < Q1 - 1.5*IQR or X > Q3 + 1.5*IQR',
                    code: 'Q1, Q3 = df.quantile([0.25, 0.75])\nIQR = Q3 - Q1',
                    impact: 'Medium',
                    bestFor: 'Univariate outliers'
                },
                {
                    name: 'Z-Score Method',
                    formula: '|Z| = |(X - Mean) / Std Dev| > 3',
                    code: 'from scipy.stats import zscore\nz_scores = np.abs(zscore(df))',
                    impact: 'Medium',
                    bestFor: 'Normally distributed data'
                },
                {
                    name: 'Isolation Forest',
                    formula: 'Isolate anomalies using random forests',
                    code: 'IsolationForest(contamination=0.1)',
                    impact: 'Low',
                    bestFor: 'Multivariate outliers'
                },
            ],
        },
        {
            id: 5,
            title: 'Feature Engineering',
            icon: '🔨',
            description: 'Create new features from existing ones',
            details: [
                'Domain knowledge application',
                'Polynomial and interaction features',
                'Time-based feature extraction',
                'Aggregate functions for grouped data',
            ],
            methods: [
                {
                    name: 'Polynomial Features',
                    formula: 'Create X², X³, X*Y for non-linear relationships',
                    code: 'PolynomialFeatures(degree=2)',
                    useCase: 'Non-linear relationships',
                    impact: 'High'
                },
                {
                    name: 'Interaction Features',
                    formula: 'X1 * X2, X1 / X2, X1 + X2',
                    code: 'df["interaction"] = df["X1"] * df["X2"]',
                    useCase: 'Feature combinations',
                    impact: 'High'
                },
                {
                    name: 'Time Features',
                    formula: 'Extract day, month, year, dayofweek, hour',
                    code: 'df["day"] = df["date"].dt.day',
                    useCase: 'Temporal data',
                    impact: 'Medium'
                },
            ],
        },
        {
            id: 6,
            title: 'Handling Class Imbalance',
            icon: '⚖️',
            description: 'Balance unequal class distributions',
            details: [
                'Identify class imbalance ratio',
                'Choose appropriate handling strategy',
                'Use stratified cross-validation',
                'Monitor on minority class metrics',
            ],
            methods: imbalanceHandling,
        },
        {
            id: 7,
            title: 'Feature Selection',
            icon: '✨',
            description: 'Select most important features',
            details: [
                'Remove low-variance features',
                'Correlation-based selection',
                'Feature importance from models',
                'Reduce dimensionality, improve speed',
            ],
            methods: [
                {
                    name: 'Variance Threshold',
                    formula: 'Remove features with variance < threshold',
                    code: 'VarianceThreshold(threshold=0.1)',
                    impact: 'Low',
                    useCase: 'Quick filtering'
                },
                {
                    name: 'Correlation Analysis',
                    formula: 'Remove features with |correlation| > 0.95',
                    code: 'df.corr()',
                    impact: 'Medium',
                    useCase: 'Multicollinearity'
                },
                {
                    name: 'Permutation Importance',
                    formula: 'Drop feature, measure performance decrease',
                    code: 'permutation_importance(model, X, y)',
                    impact: 'Low',
                    useCase: 'Model-based selection'
                },
            ],
        },
        {
            id: 8,
            title: 'Dimensionality Reduction',
            icon: '🎯',
            description: 'Reduce feature count while preserving information',
            details: [
                'Principal Component Analysis (PCA)',
                'Feature extraction techniques',
                'Balance complexity vs information',
                'Visualize high-dimensional data',
            ],
            methods: [
                {
                    name: 'PCA',
                    formula: 'Create orthogonal components explaining variance',
                    code: 'PCA(n_components=10)',
                    impact: 'Medium',
                    useCase: 'Multicollinear features'
                },
                {
                    name: 't-SNE',
                    formula: 'Non-linear dimensionality reduction',
                    code: 'TSNE(n_components=2)',
                    impact: 'Low',
                    useCase: 'Visualization'
                },
            ],
        },
    ];

    const videoTutorials = [
        {
            id: 1,
            title: 'Data Cleaning & Missing Values',
            thumbnail: '📹',
            duration: '12:34',
            url: 'https://youtu.be/dQw4w9WgXcQ',
            description: 'Learn how to handle missing data properly',
        },
        {
            id: 2,
            title: 'Feature Scaling Explained',
            thumbnail: '📹',
            duration: '8:45',
            url: 'https://youtu.be/dQw4w9WgXcQ',
            description: 'Understand normalization and standardization',
        },
        {
            id: 3,
            title: 'Categorical Encoding Techniques',
            thumbnail: '📹',
            duration: '15:20',
            url: 'https://youtu.be/dQw4w9WgXcQ',
            description: 'Master one-hot and label encoding',
        },
        {
            id: 4,
            title: 'Outlier Detection Methods',
            thumbnail: '📹',
            duration: '10:15',
            url: 'https://youtu.be/dQw4w9WgXcQ',
            description: 'Find and handle anomalous values',
        },
        {
            id: 5,
            title: 'Feature Engineering Masterclass',
            thumbnail: '📹',
            duration: '20:30',
            url: 'https://youtu.be/dQw4w9WgXcQ',
            description: 'Create powerful features from raw data',
        },
        {
            id: 6,
            title: 'PCA & Dimensionality Reduction',
            thumbnail: '📹',
            duration: '18:45',
            url: 'https://youtu.be/dQw4w9WgXcQ',
            description: 'Reduce features intelligently',
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

    const ScalingVisualization = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scalingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,107,255,0.2)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(14, 18, 33, 0.8)',
                        border: '1px solid rgba(155, 107, 255, 0.3)',
                        borderRadius: '8px',
                    }}
                />
                <Legend />
                <Bar dataKey="value" fill="#9b6bff" name="Original Values" />
                <Bar dataKey="normalized" fill="#3dd598" name="Normalized (0-1)" />
                <Bar dataKey="standardized" fill="#ff4fb7" name="Standardized (Z-score)" />
            </BarChart>
        </ResponsiveContainer>
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
                        Data Preprocessing Techniques
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 400,
                        }}
                    >
                        Step-by-step guide with visualizations and video tutorials
                    </Typography>
                </Box>
            </motion.div>

            {/* Tabs */}
            <Box sx={{ mb: 4 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(e, val) => setSelectedTab(val)}
                    sx={{
                        background: 'rgba(155, 107, 255, 0.1)',
                        borderRadius: '12px',
                        p: 1,
                        '& .MuiTab-root': {
                            color: 'rgba(255,255,255,0.6)',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                        },
                        '& .Mui-selected': {
                            color: '#9b6bff !important',
                            background: 'rgba(155, 107, 255, 0.2)',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <Tab label="Preprocessing Techniques" />
                    <Tab label="Video Tutorials" />
                    <Tab label="Quick Reference" />
                </Tabs>
            </Box>

            {/* Tab 1: Techniques */}
            {selectedTab === 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {techniques.map((technique) => (
                            <motion.div key={technique.id} variants={itemVariants} style={{ width: '100%' }}>
                                <Accordion
                                    expanded={expandedStep === technique.id}
                                    onChange={() => setExpandedStep(expandedStep === technique.id ? null : technique.id)}
                                    sx={{
                                        background: 'rgba(14, 18, 33, 0.6)',
                                        backdropFilter: 'blur(14px)',
                                        border: '1px solid rgba(155, 107, 255, 0.2)',
                                        borderRadius: '12px !important',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(14, 18, 33, 0.75)',
                                            borderColor: 'rgba(155, 107, 255, 0.4)',
                                            boxShadow: `0 8px 32px rgba(155, 107, 255, 0.2)`,
                                        },
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                            <Typography sx={{ fontSize: '28px' }}>
                                                {technique.icon}
                                            </Typography>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'white', mb: 0.5 }}>
                                                    {`${technique.id}. ${technique.title}`}
                                                </Typography>
                                                <Typography sx={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                    {technique.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            background: 'rgba(155, 107, 255, 0.05)',
                                            borderTop: '1px solid rgba(155, 107, 255, 0.2)',
                                        }}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            {/* Overview */}
                                            <Alert
                                                severity="info"
                                                sx={{
                                                    mb: 3,
                                                    background: 'rgba(155, 107, 255, 0.1)',
                                                    borderColor: 'rgba(155, 107, 255, 0.3)',
                                                    color: '#9b6bff',
                                                }}
                                            >
                                                {technique.details.map((detail, idx) => (
                                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: idx < technique.details.length - 1 ? 1 : 0 }}>
                                                        <CheckCircleIcon sx={{ fontSize: '16px' }} />
                                                        <Typography sx={{ fontSize: '13px' }}>{detail}</Typography>
                                                    </Box>
                                                ))}
                                            </Alert>

                                            {/* Visualization */}
                                            {technique.chartType === 'scaling' && (
                                                <Box sx={{ mb: 4, p: 2, background: 'rgba(155, 107, 255, 0.08)', borderRadius: '8px' }}>
                                                    <Typography sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                                                        Scaling Comparison
                                                    </Typography>
                                                    <ScalingVisualization />
                                                </Box>
                                            )}

                                            {/* Methods Table */}
                                            <Typography sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                                                Available Methods
                                            </Typography>
                                            <TableContainer sx={{ mb: 3 }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow sx={{ background: 'rgba(155, 107, 255, 0.15)' }}>
                                                            <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>
                                                                Method
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>
                                                                Formula / Description
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>
                                                                When to Use
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#9b6bff', fontWeight: 700 }}>
                                                                Code Example
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {technique.methods.map((method, idx) => (
                                                            <TableRow
                                                                key={idx}
                                                                sx={{
                                                                    '&:hover': {
                                                                        background: 'rgba(155, 107, 255, 0.05)',
                                                                    },
                                                                    borderBottom: '1px solid rgba(155, 107, 255, 0.1)',
                                                                }}
                                                            >
                                                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                                                                    {method.name}
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                                                                    <Box component="code" sx={{ background: 'rgba(0,0,0,0.3)', p: 1, borderRadius: '4px', display: 'inline-block' }}>
                                                                        {method.formula || method.description}
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                                                                    {method.useWhen || method.useCase}
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                                                                    <Box component="code" sx={{ background: 'rgba(0,0,0,0.3)', p: 1, borderRadius: '4px', display: 'inline-block' }}>
                                                                        {method.code}
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            {/* Method Details for specific techniques */}
                                            {technique.id === 3 && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                                                        Detailed Method Comparisons
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        {technique.methods.map((method, idx) => (
                                                            <Grid item xs={12} key={idx}>
                                                                <Card sx={{
                                                                    background: 'rgba(155, 107, 255, 0.08)',
                                                                    border: '1px solid rgba(155, 107, 255, 0.2)',
                                                                    p: 2,
                                                                }}>
                                                                    <Typography sx={{ fontWeight: 700, color: '#9b6bff', mb: 1 }}>
                                                                        {method.name}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                                        {method.description}
                                                                    </Typography>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} sm={6}>
                                                                            <Box>
                                                                                <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, mb: 0.5 }}>
                                                                                    Example:
                                                                                </Typography>
                                                                                <Box component="code" sx={{
                                                                                    background: 'rgba(0,0,0,0.3)',
                                                                                    p: 1,
                                                                                    borderRadius: '4px',
                                                                                    display: 'block',
                                                                                    fontSize: '11px',
                                                                                    color: '#3dd598',
                                                                                }}>
                                                                                    Input: {method.example?.input}
                                                                                </Box>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6}>
                                                                            <Box>
                                                                                <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, mb: 0.5 }}>
                                                                                    Output:
                                                                                </Typography>
                                                                                <Box component="code" sx={{
                                                                                    background: 'rgba(0,0,0,0.3)',
                                                                                    p: 1,
                                                                                    borderRadius: '4px',
                                                                                    display: 'block',
                                                                                    fontSize: '11px',
                                                                                    color: '#ff4fb7',
                                                                                }}>
                                                                                    {method.example?.output}
                                                                                </Box>
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                                        <Box>
                                                                            <Typography sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                                ✅ Pros
                                                                            </Typography>
                                                                            {method.pros?.map((pro, i) => (
                                                                                <Typography key={i} sx={{ fontSize: '12px', color: '#3dd598' }}>
                                                                                    • {pro}
                                                                                </Typography>
                                                                            ))}
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                                ❌ Cons
                                                                            </Typography>
                                                                            {method.cons?.map((con, i) => (
                                                                                <Typography key={i} sx={{ fontSize: '12px', color: '#ff6b6b' }}>
                                                                                    • {con}
                                                                                </Typography>
                                                                            ))}
                                                                        </Box>
                                                                    </Box>
                                                                    <Box sx={{ mt: 1.5 }}>
                                                                        <Typography sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                                            Best For:
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                                            {method.bestFor?.map((use, i) => (
                                                                                <Chip
                                                                                    key={i}
                                                                                    label={use}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        background: 'rgba(61, 213, 152, 0.15)',
                                                                                        color: '#3dd598',
                                                                                        fontWeight: 600,
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </Box>
                                                                    </Box>
                                                                </Card>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            )}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </motion.div>
                        ))}
                    </Grid>
                </motion.div>
            )}

            {/* Tab 2: Video Tutorials */}
            {selectedTab === 1 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {videoTutorials.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.id}>
                                <motion.div variants={itemVariants}>
                                    <Card
                                        sx={{
                                            background: 'rgba(14, 18, 33, 0.7)',
                                            border: '1px solid rgba(155, 107, 255, 0.2)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'rgba(14, 18, 33, 0.85)',
                                                borderColor: 'rgba(155, 107, 255, 0.4)',
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 32px rgba(155, 107, 255, 0.2)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                paddingBottom: '56.25%',
                                                background: 'linear-gradient(135deg, rgba(155,107,255,0.2), rgba(255,79,183,0.1))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '48px', position: 'absolute' }}>
                                                {video.thumbnail}
                                            </Typography>
                                            <Button
                                                sx={{
                                                    position: 'absolute',
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: '50%',
                                                    background: 'rgba(255, 79, 183, 0.9)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'rgba(255, 79, 183, 1)',
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <PlayArrowIcon sx={{ fontSize: '28px', ml: '4px' }} />
                                            </Button>
                                            <Chip
                                                label={video.duration}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    right: 8,
                                                    background: 'rgba(0, 0, 0, 0.7)',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                }}
                                            />
                                        </Box>
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                                                {video.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                {video.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            )}

            {/* Tab 3: Quick Reference */}
            {selectedTab === 2 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <motion.div variants={itemVariants}>
                                <Paper
                                    sx={{
                                        background: 'linear-gradient(145deg, rgba(155, 107, 255, 0.1), rgba(255, 79, 183, 0.05))',
                                        border: '1px solid rgba(155, 107, 255, 0.2)',
                                        borderRadius: '16px',
                                        p: 4,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '20px', color: 'white' }}>
                                        Quick Preprocessing Decision Tree
                                    </Typography>
                                    <Box sx={{ mb: 4 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#9b6bff', mb: 2 }}>
                                            ❓ Do you have missing values?
                                        </Typography>
                                        <Box sx={{ ml: 3, p: 2, background: 'rgba(155, 107, 255, 0.08)', borderRadius: '8px' }}>
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', mb: 1 }}>
                                                ✅ YES: Check % missing
                                            </Typography>
                                            <Box sx={{ ml: 2, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
                                                • &lt; 5%: Delete rows/columns<br />
                                                • 5-30%: Use mean/median/KNN imputation<br />
                                                • &gt; 30%: Consider advanced methods (MICE, AutoML)
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#9b6bff', mb: 2 }}>
                                            📊 What's the scale of your features?
                                        </Typography>
                                        <Box sx={{ ml: 3, p: 2, background: 'rgba(155, 107, 255, 0.08)', borderRadius: '8px' }}>
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', mb: 1 }}>
                                                Different scales? Use scaling:
                                            </Typography>
                                            <Box sx={{ ml: 2, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
                                                • Linear Models: StandardScaler (Z-score)<br />
                                                • Tree Models: No scaling needed<br />
                                                • Neural Networks: MinMaxScaler (0-1)<br />
                                                • Distance-based (KNN, KMeans): StandardScaler
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#9b6bff', mb: 2 }}>
                                            🏷️ Do you have categorical features?
                                        </Typography>
                                        <Box sx={{ ml: 3, p: 2, background: 'rgba(155, 107, 255, 0.08)', borderRadius: '8px' }}>
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', mb: 1 }}>
                                                Yes, choose encoding:
                                            </Typography>
                                            <Box sx={{ ml: 2, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
                                                • Few categories: One-Hot Encoding<br />
                                                • Ordinal data: Label Encoding<br />
                                                • High cardinality: Target Encoding or Frequency Encoding<br />
                                                • Tree models: Label Encoding is fine
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#9b6bff', mb: 2 }}>
                                            ⚡ Do you have outliers?
                                        </Typography>
                                        <Box sx={{ ml: 3, p: 2, background: 'rgba(155, 107, 255, 0.08)', borderRadius: '8px' }}>
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', mb: 1 }}>
                                                Yes, choose strategy:
                                            </Typography>
                                            <Box sx={{ ml: 2, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
                                                • Linear models: Remove or cap outliers<br />
                                                • Tree models: Ignore (robust to outliers)<br />
                                                • Distance-based: Remove outliers
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography sx={{ fontWeight: 600, color: '#9b6bff', mb: 2 }}>
                                            ✨ Do you have too many features?
                                        </Typography>
                                        <Box sx={{ ml: 3, p: 2, background: 'rgba(155, 107, 255, 0.08)', borderRadius: '8px' }}>
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', mb: 1 }}>
                                                Yes, apply feature selection/reduction:
                                            </Typography>
                                            <Box sx={{ ml: 2, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
                                                • Remove low variance: VarianceThreshold<br />
                                                • Remove correlated: FeatureSelection<br />
                                                • Reduce dimensionality: PCA, t-SNE<br />
                                                • Permutation importance: Model-based
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Checklists */}
                        <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                                <Paper
                                    sx={{
                                        background: 'linear-gradient(145deg, rgba(61, 213, 152, 0.1), rgba(155, 107, 255, 0.05))',
                                        border: '1px solid rgba(61, 213, 152, 0.2)',
                                        borderRadius: '16px',
                                        p: 3,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700, mb: 2, color: '#3dd598', fontSize: '16px' }}>
                                        ✅ Preprocessing Checklist
                                    </Typography>
                                    <Box sx={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '2' }}>
                                        ☐ Handle missing values<br />
                                        ☐ Remove duplicates<br />
                                        ☐ Detect and handle outliers<br />
                                        ☐ Scale/normalize features<br />
                                        ☐ Encode categorical variables<br />
                                        ☐ Handle class imbalance<br />
                                        ☐ Feature engineering<br />
                                        ☐ Feature selection<br />
                                        ☐ Dimensionality reduction<br />
                                        ☐ Final data validation<br />
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                                <Paper
                                    sx={{
                                        background: 'linear-gradient(145deg, rgba(255, 79, 183, 0.1), rgba(155, 107, 255, 0.05))',
                                        border: '1px solid rgba(255, 79, 183, 0.2)',
                                        borderRadius: '16px',
                                        p: 3,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700, mb: 2, color: '#ff4fb7', fontSize: '16px' }}>
                                        ⚠️ Common Mistakes to Avoid
                                    </Typography>
                                    <Box sx={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '2' }}>
                                        ✗ Scaling before train/test split<br />
                                        ✗ Using test set for parameter tuning<br />
                                        ✗ Ignoring class imbalance<br />
                                        ✗ Keeping highly correlated features<br />
                                        ✗ Not documenting preprocessing steps<br />
                                        ✗ Over-engineering features<br />
                                        ✗ Leaking target variable info<br />
                                        ✗ Not handling new data in production<br />
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            )}
        </Container>
    );
};

export default PreprocessingTechniques;
