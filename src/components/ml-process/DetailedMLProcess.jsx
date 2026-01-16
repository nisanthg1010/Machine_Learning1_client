import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowForwardIcon,
    DatasetLinked as DatasetIcon,
    AutoGraph as GraphIcon,
    Psychology as MLIcon,
    TrendingUp as TrendingIcon,
    Assessment as AssessmentIcon,
    Publish as DeployIcon,
    MonitorHeart as MonitorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import '../../styles/animations.css';

const DetailedMLProcess = () => {
    const [expandedStep, setExpandedStep] = useState(0);

    const mlStages = [
        {
            id: 1,
            title: 'Problem Definition & Requirements',
            icon: <AssessmentIcon />,
            description: 'Understanding the business problem and translating it to ML terms',
            details: [
                'Define business objectives and success metrics',
                'Identify the type of problem: Classification, Regression, or Clustering',
                'Determine the target variable and relevant features',
                'Establish performance baselines and benchmarks',
                'Define constraints: latency, accuracy, computational resources',
                'Document stakeholder expectations and use cases',
            ],
            output: 'Problem Statement Document',
            duration: '2-3 days',
            color: '#9b6bff',
        },
        {
            id: 2,
            title: 'Data Collection & Integration',
            icon: <DatasetIcon />,
            description: 'Gather data from various sources and consolidate them',
            details: [
                'Identify data sources: databases, APIs, sensors, user logs',
                'Extract data using SQL queries, ETL pipelines, or APIs',
                'Integrate data from multiple sources',
                'Handle data in different formats (CSV, JSON, Database, Images)',
                'Ensure data quality and completeness',
                'Store data in appropriate systems (Data Warehouse, Data Lake)',
            ],
            output: 'Raw Dataset',
            duration: '3-7 days',
            color: '#3dd598',
        },
        {
            id: 3,
            title: 'Exploratory Data Analysis (EDA)',
            icon: <GraphIcon />,
            description: 'Explore data structure, patterns, and relationships',
            details: [
                'Analyze data shape, size, and data types',
                'Calculate descriptive statistics (mean, median, std, quantiles)',
                'Visualize distributions: histograms, box plots, KDE plots',
                'Identify outliers and anomalies using IQR or Z-score',
                'Analyze feature correlations using correlation matrices',
                'Create business-relevant visualizations for stakeholders',
                'Identify missing patterns and data quality issues',
            ],
            output: 'EDA Report with Visualizations',
            duration: '3-5 days',
            color: '#ff4fb7',
        },
        {
            id: 4,
            title: 'Data Preprocessing & Cleaning',
            icon: <MLIcon />,
            description: 'Clean and prepare data for modeling',
            details: [
                'Handle missing values: imputation, deletion, or special handling',
                'Remove or handle duplicate records',
                'Correct data types (convert strings to numeric, dates, etc.)',
                'Fix data inconsistencies and typos',
                'Handle special characters and formatting issues',
                'Validate data constraints and business rules',
                'Create data quality dashboards for monitoring',
            ],
            output: 'Clean Dataset',
            duration: '2-4 days',
            color: '#ffa726',
        },
        {
            id: 5,
            title: 'Feature Engineering & Selection',
            icon: <TrendingIcon />,
            description: 'Create and select relevant features for modeling',
            details: [
                'Create new features from existing ones (domain knowledge)',
                'Handle categorical variables: encoding, one-hot encoding',
                'Scaling and normalization: StandardScaler, MinMaxScaler',
                'Feature interactions and polynomial features',
                'Domain-specific transformations (log, sqrt, etc.)',
                'Select top features using: correlation, feature importance, chi-square',
                'Reduce dimensionality using PCA or t-SNE',
                'Handle class imbalance: oversampling, undersampling, SMOTE',
            ],
            output: 'Feature Matrix',
            duration: '3-5 days',
            color: '#6c63ff',
        },
        {
            id: 6,
            title: 'Data Splitting',
            icon: <ArrowForwardIcon />,
            description: 'Divide data into training, validation, and test sets',
            details: [
                'Split ratio: typically 70-80% train, 10-15% validation, 10-15% test',
                'Use stratified split for classification (preserve class distribution)',
                'Handle time-series data with chronological split',
                'Create k-fold cross-validation splits for robust evaluation',
                'Ensure no data leakage between sets',
                'Document split strategy for reproducibility',
            ],
            output: 'Train, Validation, Test Sets',
            duration: '1 day',
            color: '#4fc3f7',
        },
        {
            id: 7,
            title: 'Model Selection & Baseline',
            icon: <MLIcon />,
            description: 'Choose appropriate algorithms for the problem',
            details: [
                'Understand algorithm characteristics and assumptions',
                'Classification: Logistic Regression, Decision Trees, Random Forest, SVM',
                'Regression: Linear Regression, Decision Trees, Gradient Boosting, Neural Networks',
                'Clustering: K-Means, DBSCAN, Hierarchical Clustering',
                'Select baseline model for comparison',
                'Document algorithm selection rationale',
                'Plan for ensemble methods if needed',
            ],
            output: 'Selected Algorithms',
            duration: '2-3 days',
            color: '#9b6bff',
        },
        {
            id: 8,
            title: 'Model Training',
            icon: <TrendingIcon />,
            description: 'Train models on the training dataset',
            details: [
                'Initialize model with default hyperparameters',
                'Fit model on training data',
                'Track training time and computational resources',
                'Monitor for overfitting/underfitting on validation set',
                'Save training logs and checkpoints',
                'Document training configuration and random seeds',
                'Implement early stopping for iterative algorithms',
            ],
            output: 'Trained Models',
            duration: '1-5 days',
            color: '#3dd598',
        },
        {
            id: 9,
            title: 'Hyperparameter Tuning',
            icon: <AssessmentIcon />,
            description: 'Optimize model hyperparameters for best performance',
            details: [
                'Identify key hyperparameters for each algorithm',
                'Use Grid Search for exhaustive parameter combinations',
                'Use Random Search for large parameter spaces',
                'Implement Bayesian Optimization for efficiency',
                'Perform cross-validation during tuning',
                'Track and compare hyperparameter results',
                'Save best hyperparameters and model checkpoints',
            ],
            output: 'Optimized Models',
            duration: '2-7 days',
            color: '#ff4fb7',
        },
        {
            id: 10,
            title: 'Model Evaluation',
            icon: <AssessmentIcon />,
            description: 'Evaluate model performance on test set',
            details: [
                'Classification: Accuracy, Precision, Recall, F1-Score, ROC-AUC',
                'Regression: MSE, RMSE, MAE, R², Adjusted R²',
                'Clustering: Silhouette Score, Davies-Bouldin Index, Calinski-Harabasz',
                'Create confusion matrices and ROC curves',
                'Perform per-class/per-feature analysis',
                'Compare models using statistical significance tests',
                'Document performance gaps and insights',
            ],
            output: 'Evaluation Report',
            duration: '1-2 days',
            color: '#ffa726',
        },
        {
            id: 11,
            title: 'Model Visualization & Interpretation',
            icon: <GraphIcon />,
            description: 'Visualize and explain model decisions',
            details: [
                'Feature importance: SHAP values, permutation importance',
                'Partial dependence plots for feature effects',
                'Decision boundaries for classification models',
                'Learning curves to diagnose bias/variance',
                'Error analysis: identify common failure modes',
                'LIME for local model interpretability',
                'Create business-friendly visualizations',
            ],
            output: 'Interpretation Report',
            duration: '1-3 days',
            color: '#6c63ff',
        },
        {
            id: 12,
            title: 'Deployment & Monitoring',
            icon: <DeployIcon />,
            description: 'Deploy model to production and monitor performance',
            details: [
                'Convert model to production format (pickle, ONNX, SavedModel)',
                'Create prediction APIs and endpoints',
                'Implement model versioning and rollback strategies',
                'Set up monitoring for model performance drift',
                'Create alerts for performance degradation',
                'Document deployment architecture and troubleshooting',
                'Plan for regular retraining schedules',
                'Implement logging and audit trails',
            ],
            output: 'Production Model',
            duration: 'Ongoing',
            color: '#4fc3f7',
        },
        {
            id: 13,
            title: 'Performance Monitoring',
            icon: <MonitorIcon />,
            description: 'Continuously monitor model performance',
            details: [
                'Track prediction accuracy in production',
                'Monitor data drift: input distribution changes',
                'Monitor concept drift: target variable changes',
                'Create performance dashboards and alerts',
                'Collect feedback from end-users',
                'Compare current vs. baseline performance',
                'Document performance metrics over time',
                'Identify retraining triggers',
            ],
            output: 'Monitoring Dashboard',
            duration: 'Ongoing',
            color: '#3dd598',
        },
        {
            id: 14,
            title: 'Model Retraining & Iteration',
            icon: <TrendingIcon />,
            description: 'Retrain model with new data and improvements',
            details: [
                'Trigger retraining based on performance degradation',
                'Incorporate new data and user feedback',
                'Experiment with new features and algorithms',
                'A/B test new models against production models',
                'Update hyperparameters based on new data patterns',
                'Version control all model configurations',
                'Document improvements and changes',
            ],
            output: 'Improved Models',
            duration: 'Continuous',
            color: '#ff4fb7',
        },
        {
            id: 15,
            title: 'Documentation & Knowledge Sharing',
            icon: <AssessmentIcon />,
            description: 'Document the entire ML pipeline for maintenance',
            details: [
                'Create comprehensive documentation of the entire pipeline',
                'Document assumptions, limitations, and constraints',
                'Provide step-by-step guides for reproduction',
                'Create runbooks for troubleshooting and retraining',
                'Document data dictionaries and feature descriptions',
                'Share knowledge with stakeholders and team members',
                'Create training materials for new team members',
                'Maintain updated README and wiki pages',
            ],
            output: 'Complete Documentation',
            duration: 'Ongoing',
            color: '#6c63ff',
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
                        Complete ML Pipeline & Process
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 400,
                        }}
                    >
                        From Problem Definition to Continuous Monitoring
                    </Typography>
                </Box>
            </motion.div>

            {/* Process Overview */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {mlStages.map((stage) => (
                        <motion.div key={stage.id} variants={itemVariants} style={{ width: '100%' }}>
                            <Accordion
                                expanded={expandedStep === stage.id}
                                onChange={() => setExpandedStep(expandedStep === stage.id ? null : stage.id)}
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
                                    '&.Mui-expanded': {
                                        background: 'rgba(14, 18, 33, 0.8)',
                                        borderColor: `rgba(155, 107, 255, 0.5)`,
                                    },
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 44,
                                                height: 44,
                                                borderRadius: '50%',
                                                background: `rgba(155, 107, 255, 0.15)`,
                                                border: '2px solid rgba(155, 107, 255, 0.3)',
                                                color: '#9b6bff',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {stage.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '16px',
                                                    color: 'white',
                                                    mb: 0.5,
                                                }}
                                            >
                                                {`${stage.id}. ${stage.title}`}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                }}
                                            >
                                                {stage.description}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={stage.duration}
                                            size="small"
                                            sx={{
                                                background: 'rgba(155, 107, 255, 0.15)',
                                                border: '1px solid rgba(155, 107, 255, 0.3)',
                                                color: '#9b6bff',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        background: 'rgba(155, 107, 255, 0.05)',
                                        borderTop: '1px solid rgba(155, 107, 255, 0.2)',
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: '#9b6bff',
                                                fontWeight: 700,
                                                mb: 2,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontSize: '12px',
                                            }}
                                        >
                                            Key Activities
                                        </Typography>
                                        <List disablePadding>
                                            {stage.details.map((detail, idx) => (
                                                <ListItem
                                                    key={idx}
                                                    disableGutters
                                                    sx={{
                                                        py: 1,
                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 32,
                                                            color: '#3dd598',
                                                        }}
                                                    >
                                                        <CheckCircleIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={detail}
                                                        primaryTypographyProps={{
                                                            sx: {
                                                                fontSize: '14px',
                                                                color: 'rgba(255, 255, 255, 0.8)',
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                            <Card
                                                sx={{
                                                    background: 'rgba(61, 213, 152, 0.1)',
                                                    border: '1px solid rgba(61, 213, 152, 0.3)',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '12px',
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            fontWeight: 600,
                                                            mb: 1,
                                                        }}
                                                    >
                                                        Output
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: '#3dd598',
                                                            fontWeight: 700,
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {stage.output}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                            <Card
                                                sx={{
                                                    background: 'rgba(255, 79, 183, 0.1)',
                                                    border: '1px solid rgba(255, 79, 183, 0.3)',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '12px',
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            fontWeight: 600,
                                                            mb: 1,
                                                        }}
                                                    >
                                                        Typical Duration
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: '#ff4fb7',
                                                            fontWeight: 700,
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        {stage.duration}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}
                </Grid>
            </motion.div>

            {/* Key Takeaways */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(145deg, rgba(155, 107, 255, 0.1), rgba(255, 79, 183, 0.05))',
                        border: '1px solid rgba(155, 107, 255, 0.2)',
                        borderRadius: '16px',
                        p: 4,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: 'white',
                        }}
                    >
                        Key Takeaways
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '32px',
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #9b6bff 0%, #ff4fb7 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1,
                                    }}
                                >
                                    15
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                                    ML Pipeline Stages
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '32px',
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #3dd598 0%, #9b6bff 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1,
                                    }}
                                >
                                    80%
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                                    Time on Data Preparation
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '32px',
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #ffa726 0%, #ff4fb7 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1,
                                    }}
                                >
                                    Iterative
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                                    ML is Never Complete
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: '32px',
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #6c63ff 0%, #3dd598 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 1,
                                    }}
                                >
                                    Continuous
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                                    Monitoring & Retraining
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default DetailedMLProcess;
