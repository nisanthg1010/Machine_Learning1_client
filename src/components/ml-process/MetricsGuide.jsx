import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { motion } from 'framer-motion';

const MetricsGuide = () => {
  const [activeTab, setActiveTab] = useState(0);

  const metricsData = {
    classification: [
      {
        name: 'Accuracy',
        formula: '(TP + TN) / (TP + TN + FP + FN)',
        description: 'Percentage of correct predictions',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'Overall performance metric'
      },
      {
        name: 'Precision',
        formula: 'TP / (TP + FP)',
        description: 'Of predicted positive, how many are correct',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'When false positives are costly'
      },
      {
        name: 'Recall (Sensitivity)',
        formula: 'TP / (TP + FN)',
        description: 'Of actual positive, how many did we find',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'When false negatives are costly'
      },
      {
        name: 'F1-Score',
        formula: '2 × (Precision × Recall) / (Precision + Recall)',
        description: 'Harmonic mean of Precision and Recall',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'Balanced metric for imbalanced classes'
      },
      {
        name: 'AUC-ROC',
        formula: 'Area Under the ROC Curve',
        description: 'Measure of model\'s ability to distinguish classes',
        range: '0 to 1',
        bestValue: '0.5 = random, 1.0 = perfect',
        use: 'For evaluating binary classification'
      },
      {
        name: 'Specificity',
        formula: 'TN / (TN + FP)',
        description: 'Of actual negative, how many did we identify correctly',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'When false positives matter'
      },
      {
        name: 'Confusion Matrix',
        formula: '[[TP, FP], [FN, TN]]',
        description: 'Matrix showing predictions vs actual values',
        range: 'Count values',
        bestValue: 'Large TP and TN, small FP and FN',
        use: 'Detailed understanding of predictions'
      }
    ],
    regression: [
      {
        name: 'Mean Squared Error (MSE)',
        formula: 'Σ(yi - ŷi)² / n',
        description: 'Average of squared differences between actual and predicted',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Penalizes large errors more'
      },
      {
        name: 'Root Mean Squared Error (RMSE)',
        formula: '√(Σ(yi - ŷi)² / n)',
        description: 'Square root of MSE, in same units as target',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Interpretable error metric'
      },
      {
        name: 'Mean Absolute Error (MAE)',
        formula: 'Σ|yi - ŷi| / n',
        description: 'Average absolute differences between actual and predicted',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Robust to outliers'
      },
      {
        name: 'R² Score (Coefficient of Determination)',
        formula: '1 - (SS_res / SS_tot)',
        description: 'Proportion of variance explained by the model',
        range: '-∞ to 1',
        bestValue: 'Higher is better, 1 = perfect',
        use: 'Comparing model fit'
      },
      {
        name: 'Adjusted R²',
        formula: '1 - ((1-R²)(n-1)/(n-p-1))',
        description: 'R² adjusted for number of predictors',
        range: '-∞ to 1',
        bestValue: 'Higher is better',
        use: 'When comparing models with different features'
      },
      {
        name: 'Mean Percentage Error (MPE)',
        formula: '(Σ((yi - ŷi)/yi) / n) × 100',
        description: 'Average percentage difference',
        range: '-∞ to ∞',
        bestValue: 'Close to 0',
        use: 'For percentage-based analysis'
      }
    ],
    clustering: [
      {
        name: 'Silhouette Score',
        formula: '(b - a) / max(a, b)',
        description: 'Measures how similar an object is to its own cluster vs other clusters',
        range: '-1 to 1',
        bestValue: 'Higher is better, 1 = perfect',
        use: 'Evaluate cluster quality'
      },
      {
        name: 'Davies-Bouldin Index',
        formula: '(1/k) Σ max(i≠j) (Si + Sj) / Dij',
        description: 'Average similarity between each cluster and its most similar cluster',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Internal cluster validation'
      },
      {
        name: 'Calinski-Harabasz Score',
        formula: '(SS_B / SS_W) × ((n - k) / (k - 1))',
        description: 'Ratio of between-cluster to within-cluster dispersion',
        range: '0 to ∞',
        bestValue: 'Higher is better',
        use: 'Cluster separation measure'
      },
      {
        name: 'Inertia',
        formula: 'Σ ||xi - cj||²',
        description: 'Sum of squared distances from samples to nearest cluster center',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Elbow method for optimal k'
      },
      {
        name: 'Homogeneity Score',
        formula: '1 - (H(C|K) / H(C))',
        description: 'Each cluster contains only members of a single class',
        range: '0 to 1',
        bestValue: '1 = perfect homogeneity',
        use: 'When true labels are available'
      },
      {
        name: 'Completeness Score',
        formula: '1 - (H(K|C) / H(K))',
        description: 'All members of a class are assigned to the same cluster',
        range: '0 to 1',
        bestValue: '1 = perfect completeness',
        use: 'When true labels are available'
      }
    ],
    neuralNetwork: [
      {
        name: 'Training Loss',
        formula: 'Loss = L(y_true, y_pred)',
        description: 'Error on training set (e.g., cross-entropy, MSE)',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Monitor training progress'
      },
      {
        name: 'Validation Loss',
        formula: 'Loss = L(y_val_true, y_val_pred)',
        description: 'Error on validation set',
        range: '0 to ∞',
        bestValue: 'Lower is better',
        use: 'Detect overfitting'
      },
      {
        name: 'Training Accuracy',
        formula: 'Correct predictions / Total training samples',
        description: 'Accuracy on training data',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'Monitor training performance'
      },
      {
        name: 'Validation Accuracy',
        formula: 'Correct predictions / Total validation samples',
        description: 'Accuracy on validation data',
        range: '0 to 1',
        bestValue: 'Higher is better',
        use: 'Detect overfitting'
      },
      {
        name: 'Overfitting Detection',
        formula: 'If (Val_Loss > Train_Loss) → Model is overfitting',
        description: 'When model performs well on train but poorly on validation',
        range: 'Boolean',
        bestValue: 'Training loss ≈ Validation loss',
        use: 'Early stopping, regularization'
      },
      {
        name: 'Epoch Time',
        formula: 'Time to train one epoch',
        description: 'Training speed indicator',
        range: 'Seconds/epoch',
        bestValue: 'Fast training',
        use: 'Performance monitoring'
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderMetricsTable = (data) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(155,107,255,0.05)',
          border: '1px solid rgba(155,107,255,0.2)',
          borderRadius: 2,
          mt: 2
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'rgba(155,107,255,0.1)' }}>
              <TableCell sx={{ color: '#9b6bff', fontWeight: 'bold' }}>Metric</TableCell>
              <TableCell sx={{ color: '#9b6bff', fontWeight: 'bold' }}>Formula</TableCell>
              <TableCell sx={{ color: '#9b6bff', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: '#9b6bff', fontWeight: 'bold' }}>Range</TableCell>
              <TableCell sx={{ color: '#9b6bff', fontWeight: 'bold' }}>Best Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <motion.tr key={idx} variants={itemVariants}>
                <TableRow sx={{
                  '&:hover': {
                    background: 'rgba(155,107,255,0.1)'
                  }
                }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', fontSize: '12px' }}>
                    {row.formula}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{row.description}</TableCell>
                  <TableCell sx={{ color: '#3dd598' }}>{row.range}</TableCell>
                  <TableCell sx={{ color: '#ff4fb7', fontWeight: 600 }}>{row.bestValue}</TableCell>
                </TableRow>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );

  return (
    <Box sx={{ width: '100%', py: 4, px: 2 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #3dd598, #9b6bff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            ML Metrics & Formulas Guide
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Complete reference for all evaluation metrics with formulas
          </Typography>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Paper
        sx={{
          background: 'linear-gradient(160deg, rgba(155,107,255,0.1), rgba(61,213,152,0.05))',
          borderRadius: 3,
          border: '1px solid rgba(155,107,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            borderBottom: '1px solid rgba(155,107,255,0.2)',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': { color: '#9b6bff' }
            },
            '& .Mui-selected': {
              color: '#9b6bff !important'
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)'
            }
          }}
        >
          <Tab label="Classification" />
          <Tab label="Regression" />
          <Tab label="Clustering" />
          <Tab label="Neural Networks" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderMetricsTable(metricsData.classification)}
          {activeTab === 1 && renderMetricsTable(metricsData.regression)}
          {activeTab === 2 && renderMetricsTable(metricsData.clustering)}
          {activeTab === 3 && renderMetricsTable(metricsData.neuralNetwork)}
        </Box>
      </Paper>

      {/* Legend for Classification Metrics */}
      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Paper
            sx={{
              mt: 4,
              p: 3,
              background: 'rgba(61,213,152,0.1)',
              border: '1px solid rgba(61,213,152,0.2)',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ color: '#3dd598', fontWeight: 700, mb: 2 }}>
              Classification Confusion Matrix Legend
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: 'white', mb: 1 }}>
                  <strong style={{ color: '#3dd598' }}>TP (True Positive):</strong> Correctly predicted positive
                </Typography>
                <Typography sx={{ color: 'white', mb: 1 }}>
                  <strong style={{ color: '#ff4fb7' }}>FP (False Positive):</strong> Incorrectly predicted positive
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: 'white', mb: 1 }}>
                  <strong style={{ color: '#9b6bff' }}>TN (True Negative):</strong> Correctly predicted negative
                </Typography>
                <Typography sx={{ color: 'white', mb: 1 }}>
                  <strong style={{ color: '#ffa726' }}>FN (False Negative):</strong> Incorrectly predicted negative
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default MetricsGuide;
