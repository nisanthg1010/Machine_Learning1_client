import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Stepper, Step, StepLabel, StepContent, Accordion, AccordionSummary, AccordionDetails, Chip, Grid, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const MLProcessWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const steps = [
    {
      label: 'Problem Definition',
      description: 'Identify the objective and type of problem',
      details: [
        'Define problem type: Regression, Classification, Clustering, or Dimensionality Reduction',
        'Identify the objective of the machine learning system',
        'Define success criteria and evaluation metrics',
        'Establish baseline performance targets'
      ],
      metrics: ['Problem Type', 'Target Variable', 'Success Metrics']
    },
    {
      label: 'Data Collection',
      description: 'Gather data from various sources',
      details: [
        'Collect data from CSV uploads, public datasets, or APIs',
        'Verify data format, consistency, and completeness',
        'Check for data quality issues',
        'Document data sources and collection methods'
      ],
      metrics: ['Dataset Size', 'Feature Count', 'Data Quality Score']
    },
    {
      label: 'Data Exploration & Understanding',
      description: 'Analyze and visualize the dataset',
      details: [
        'Inspect dataset structure and data types',
        'Identify numerical and categorical features',
        'Analyze target variable distribution',
        'Perform exploratory data analysis (EDA)',
        'Generate summary statistics and correlations',
        'Create initial visualizations'
      ],
      metrics: ['Mean', 'Std Dev', 'Correlation', 'Skewness']
    },
    {
      label: 'Data Preprocessing',
      description: 'Clean and transform the data',
      details: [
        'Handle missing values (imputation, removal)',
        'Remove duplicate records',
        'Detect and handle outliers (Z-score, IQR)',
        'Encode categorical variables (Label, One-Hot)',
        'Scale features (StandardScaler, MinMaxScaler)',
        'Perform feature engineering and selection'
      ],
      metrics: ['Missing %', 'Duplicates', 'Outliers Detected']
    },
    {
      label: 'Dataset Splitting',
      description: 'Divide data into train, test, and validation sets',
      details: [
        'Split training set: 70-80% of data',
        'Split testing set: 20-30% of data',
        'Optional: Create validation set for neural networks',
        'Ensure stratified splits for imbalanced data',
        'Maintain same feature distributions across splits'
      ],
      metrics: ['Train Size', 'Test Size', 'Validation Size']
    },
    {
      label: 'Model Selection',
      description: 'Choose appropriate algorithms',
      details: [
        'Select from 25+ supervised learning models',
        'Choose from 14+ unsupervised learning algorithms',
        'Consider 6+ neural network architectures',
        'Match algorithm to problem type',
        'Consider computational requirements and scalability'
      ],
      metrics: ['Algorithm Type', 'Complexity', 'Training Time']
    },
    {
      label: 'Model Training',
      description: 'Fit model on training data',
      details: [
        'Initialize model with hyperparameters',
        'Fit model on training dataset',
        'Monitor training progress',
        'Learn patterns and relationships in data',
        'Optimize weights and parameters iteratively'
      ],
      metrics: ['Training Loss', 'Training Accuracy', 'Epoch Time']
    },
    {
      label: 'Hyperparameter Tuning',
      description: 'Optimize model parameters',
      details: [
        'Perform Grid Search with Cross-Validation',
        'Tune learning rate, regularization, depth, etc.',
        'Use k-fold cross-validation (typically k=5)',
        'Compare multiple hyperparameter combinations',
        'Select best parameters based on validation score'
      ],
      metrics: ['Best Params', 'CV Score', 'Best Alpha/LR']
    },
    {
      label: 'Model Evaluation',
      description: 'Assess model performance',
      details: [
        'Classification: Accuracy, Precision, Recall, F1-Score, ROC-AUC',
        'Regression: MSE, RMSE, R² Score, MAE',
        'Clustering: Silhouette Score, Davies-Bouldin Index',
        'Neural Networks: Training vs Validation curves',
        'Generate confusion matrices and visualizations'
      ],
      metrics: ['Accuracy', 'Precision', 'F1-Score', 'AUC-ROC']
    },
    {
      label: 'Visualization & Interpretation',
      description: 'Visualize results and insights',
      details: [
        'Create confusion matrix heatmaps',
        'Plot actual vs predicted values',
        'Visualize feature importance',
        'Generate loss and accuracy curves',
        'Create cluster visualizations',
        'Provide interpretable model explanations'
      ],
      metrics: ['Charts Generated', 'Insights Extracted']
    },
    {
      label: 'Model Deployment',
      description: 'Make model production-ready',
      details: [
        'Export trained model to file',
        'Create REST API endpoints',
        'Deploy microservice on cloud platforms',
        'Integrate with frontend dashboard',
        'Set up monitoring and logging'
      ],
      metrics: ['API Status', 'Response Time', 'Uptime']
    },
    {
      label: 'Monitoring & Maintenance',
      description: 'Monitor and maintain model',
      details: [
        'Track model performance over time',
        'Detect data drift and model degradation',
        'Retrain model with new data periodically',
        'Update hyperparameters based on performance',
        'Maintain detailed logs and metrics'
      ],
      metrics: ['Performance Drift', 'Retraining Frequency']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Box sx={{ width: '100%', py: 4, px: 2 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Machine Learning Process Workflow
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 300
            }}
          >
            Complete ML pipeline from data to deployment
          </Typography>
        </Box>
      </motion.div>

      {/* Process Stepper */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Paper
          sx={{
            p: 4,
            background: 'linear-gradient(160deg, rgba(155,107,255,0.1), rgba(255,79,183,0.05))',
            borderRadius: 3,
            border: '1px solid rgba(155,107,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Step>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: activeStep >= index
                            ? 'linear-gradient(135deg, #9b6bff, #ff4fb7)'
                            : 'rgba(155,107,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 8px 32px rgba(255,79,183,0.4)'
                          }
                        }}
                        onClick={() => setActiveStep(index)}
                      >
                        {activeStep > index ? (
                          <CheckCircleIcon sx={{ fontSize: 24 }} />
                        ) : (
                          index + 1
                        )}
                      </Box>
                    )}
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { color: '#9b6bff' }
                      }
                    }}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ ml: 2, mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        {step.description}
                      </Typography>

                      {/* Details */}
                      <Box sx={{ mb: 2 }}>
                        {step.details.map((detail, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255,255,255,0.7)',
                                pl: 2,
                                py: 0.5,
                                borderLeft: '2px solid rgba(155,107,255,0.5)',
                                mb: 1
                              }}
                            >
                              • {detail}
                            </Typography>
                          </motion.div>
                        ))}
                      </Box>

                      {/* Metrics */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                        {step.metrics.map((metric, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Chip
                              label={metric}
                              sx={{
                                background: 'rgba(155,107,255,0.2)',
                                color: '#9b6bff',
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: '12px',
                                '&:hover': {
                                  background: 'rgba(155,107,255,0.3)',
                                  transform: 'translateY(-2px)',
                                  transition: 'all 0.3s ease'
                                }
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </StepContent>
                </Step>
              </motion.div>
            ))}
          </Stepper>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default MLProcessWorkflow;
