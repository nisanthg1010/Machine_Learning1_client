import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ModelDashboard = ({ datasetId, problemType, onTrainingComplete }) => {
  const [tabValue, setTabValue] = useState(0);
  const [testSplit, setTestSplit] = useState(0.2);
  const [trainingSplit, setTrainingSplit] = useState(0.8);
  const [models, setModels] = useState([]);
  const [bestModel, setBestModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedMetrics, setSelectedMetrics] = useState(null);
  const [formulaDialog, setFormulaDialog] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState(null);

  const isClassification = problemType === 'classification';
  const isRegression = problemType === 'regression';

  // Metric formulas
  const metricFormulas = {
    accuracy: {
      name: 'Accuracy',
      formula: '(TP + TN) / (TP + TN + FP + FN)',
      description: 'Proportion of correct predictions',
      range: '0 to 1 (higher is better)',
      use_case: 'Classification problems with balanced classes'
    },
    precision: {
      name: 'Precision',
      formula: 'TP / (TP + FP)',
      description: 'Proportion of positive predictions that were correct',
      range: '0 to 1 (higher is better)',
      use_case: 'When false positives are costly (e.g., spam detection)'
    },
    recall: {
      name: 'Recall (Sensitivity)',
      formula: 'TP / (TP + FN)',
      description: 'Proportion of actual positives that were correctly identified',
      range: '0 to 1 (higher is better)',
      use_case: 'When false negatives are costly (e.g., disease detection)'
    },
    f1_score: {
      name: 'F1 Score',
      formula: '2 × (Precision × Recall) / (Precision + Recall)',
      description: 'Harmonic mean of precision and recall',
      range: '0 to 1 (higher is better)',
      use_case: 'Balanced metric for imbalanced datasets'
    },
    mse: {
      name: 'Mean Squared Error (MSE)',
      formula: '(1/n) × Σ(y_i - ŷ_i)²',
      description: 'Average squared difference between actual and predicted values',
      range: '0 to ∞ (lower is better)',
      use_case: 'Regression problems, penalizes large errors more'
    },
    rmse: {
      name: 'Root Mean Squared Error (RMSE)',
      formula: '√(MSE)',
      description: 'Square root of MSE, in same units as target variable',
      range: '0 to ∞ (lower is better)',
      use_case: 'Regression, interpretable in original units'
    },
    r2_score: {
      name: 'R² Score (Coefficient of Determination)',
      formula: '1 - (SS_res / SS_tot)',
      description: 'Proportion of variance explained by the model',
      range: '-∞ to 1 (higher is better, 1 is perfect)',
      use_case: 'Regression, indicates goodness of fit'
    },
    silhouette_score: {
      name: 'Silhouette Score',
      formula: '(b - a) / max(a, b)',
      description: 'Measure of cluster separation quality',
      range: '-1 to 1 (higher is better)',
      use_case: 'Clustering evaluation'
    },
    davies_bouldin_score: {
      name: 'Davies-Bouldin Score',
      formula: 'avg(max(S_i + S_j) / d(c_i, c_j))',
      description: 'Average similarity ratio of each cluster with its most similar cluster',
      range: '0 to ∞ (lower is better)',
      use_case: 'Clustering evaluation'
    }
  };

  // Algorithm recommendations based on dataset characteristics
  const getAlgorithmRecommendations = () => {
    const recommendations = {
      classification: [
        { name: 'Random Forest Classifier', reason: 'Excellent for most classification tasks, handles feature interactions well' },
        { name: 'Gradient Boosting Classifier', reason: 'High accuracy, works well with mixed feature types' },
        { name: 'SVM Classifier', reason: 'Strong for binary classification, works well in high dimensions' },
        { name: 'Logistic Regression', reason: 'Fast baseline, good for linear decision boundaries' }
      ],
      regression: [
        { name: 'Gradient Boosting Regressor', reason: 'High accuracy, handles non-linear relationships' },
        { name: 'Random Forest Regressor', reason: 'Robust, handles missing values well' },
        { name: 'Support Vector Regression', reason: 'Excellent for non-linear patterns' },
        { name: 'Ridge Regression', reason: 'Fast baseline with regularization' }
      ],
      clustering: [
        { name: 'KMeans', reason: 'Fast, suitable for spherical clusters' },
        { name: 'DBSCAN', reason: 'Finds arbitrary-shaped clusters, no need to specify k' },
        { name: 'Hierarchical Clustering', reason: 'Builds dendrograms, good for exploration' }
      ]
    };
    return recommendations[problemType] || recommendations.classification;
  };

  // Simulate model training and evaluation
  const trainModels = async () => {
    setLoading(true);
    setTrainingProgress(0);

    try {
      // Simulate training multiple models
      const algorithmRecommendations = getAlgorithmRecommendations();
      const trainedModels = [];

      for (let i = 0; i < algorithmRecommendations.length; i++) {
        // Simulate training progress
        await new Promise(resolve => setTimeout(resolve, 500));
        setTrainingProgress(Math.round(((i + 1) / algorithmRecommendations.length) * 100));

        // Generate mock metrics based on algorithm
        const mockMetrics = generateMockMetrics(algorithmRecommendations[i].name, i);
        trainedModels.push(mockMetrics);
      }

      setModels(trainedModels);
      
      // Find best model based on primary metric
      const best = findBestModel(trainedModels);
      setBestModel(best);

      // Call onTrainingComplete callback if provided
      if (onTrainingComplete) {
        const experimentData = {
          _id: Date.now().toString(),
          datasetId: datasetId,
          problemType: problemType,
          trainedModels: trainedModels,
          bestModel: best,
          testSplit: testSplit,
          trainingSplit: trainingSplit,
          createdAt: new Date(),
          testMetrics: best
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        onTrainingComplete(experimentData);
      }
    } catch (error) {
      console.error('Error training models:', error);
    } finally {
      setLoading(false);
      setTrainingProgress(0);
    }
  };

  const generateMockMetrics = (modelName, index) => {
    const baseScore = 0.75 + (Math.random() * 0.2);
    
    if (isClassification) {
      return {
        algorithm: modelName,
        accuracy: Math.round((baseScore + Math.random() * 0.1) * 1000) / 1000,
        precision: Math.round((baseScore - Math.random() * 0.05) * 1000) / 1000,
        recall: Math.round((baseScore - Math.random() * 0.08) * 1000) / 1000,
        f1_score: Math.round((baseScore - Math.random() * 0.05) * 1000) / 1000,
        training_metrics: {
          accuracy: Math.round((baseScore + Math.random() * 0.15) * 1000) / 1000,
          precision: Math.round((baseScore + Math.random() * 0.1) * 1000) / 1000,
          recall: Math.round((baseScore + Math.random() * 0.1) * 1000) / 1000,
          f1_score: Math.round((baseScore + Math.random() * 0.1) * 1000) / 1000
        },
        test_metrics: {
          accuracy: Math.round((baseScore - Math.random() * 0.05) * 1000) / 1000,
          precision: Math.round((baseScore - Math.random() * 0.08) * 1000) / 1000,
          recall: Math.round((baseScore - Math.random() * 0.08) * 1000) / 1000,
          f1_score: Math.round((baseScore - Math.random() * 0.08) * 1000) / 1000
        }
      };
    } else {
      const rmse = Math.round((Math.random() * 0.5 + 0.1) * 1000) / 1000;
      return {
        algorithm: modelName,
        mse: Math.round((rmse * rmse) * 1000) / 1000,
        rmse: rmse,
        r2_score: Math.round((baseScore - Math.random() * 0.15) * 1000) / 1000,
        training_metrics: {
          mse: Math.round((rmse * rmse * 0.9) * 1000) / 1000,
          rmse: Math.round((rmse * 0.95) * 1000) / 1000,
          r2_score: Math.round((baseScore - Math.random() * 0.1) * 1000) / 1000
        },
        test_metrics: {
          mse: Math.round((rmse * rmse * 1.1) * 1000) / 1000,
          rmse: Math.round((rmse * 1.05) * 1000) / 1000,
          r2_score: Math.round((baseScore - Math.random() * 0.2) * 1000) / 1000
        }
      };
    }
  };

  const findBestModel = (trainedModels) => {
    if (trainedModels.length === 0) return null;

    let best = trainedModels[0];
    for (let model of trainedModels) {
      const bestScore = isClassification 
        ? (best.f1_score || 0) 
        : (best.r2_score || 0);
      const currentScore = isClassification 
        ? (model.f1_score || 0) 
        : (model.r2_score || 0);
      
      if (currentScore > bestScore) {
        best = model;
      }
    }
    return best;
  };

  const handleSplitChange = (newTrain) => {
    const newTest = 1 - newTrain;
    if (newTrain > 0 && newTrain < 1) {
      setTrainingSplit(Math.round(newTrain * 100) / 100);
      setTestSplit(Math.round(newTest * 100) / 100);
    }
  };

  const MetricsCard = ({ model }) => {
    if (!model) return null;

    const isPrimary = bestModel && bestModel.algorithm === model.algorithm;

    return (
      <Card
        sx={{
          mb: 2,
          border: isPrimary ? '2px solid #9b6bff' : '1px solid rgba(255,255,255,0.1)',
          background: isPrimary 
            ? 'linear-gradient(160deg, rgba(155,107,255,0.15), rgba(255,79,183,0.1))'
            : 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
          boxShadow: isPrimary ? '0 8px 32px rgba(155,107,255,0.2)' : 'none'
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {model.algorithm}
            </Typography>
            {isPrimary && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Best Model"
                color="primary"
                variant="outlined"
                sx={{ borderColor: '#9b6bff', color: '#9b6bff' }}
              />
            )}
          </Stack>

          <Grid container spacing={2}>
            {/* Test Metrics */}
            {isClassification ? (
              <>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(61,213,152,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">Accuracy</Typography>
                    <Typography variant="h6" sx={{ color: '#3dd598', fontWeight: 700 }}>
                      {(model.accuracy * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(155,107,255,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">Precision</Typography>
                    <Typography variant="h6" sx={{ color: '#9b6bff', fontWeight: 700 }}>
                      {(model.precision * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(255,79,183,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">Recall</Typography>
                    <Typography variant="h6" sx={{ color: '#ff4fb7', fontWeight: 700 }}>
                      {(model.recall * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(255,193,7,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">F1 Score</Typography>
                    <Typography variant="h6" sx={{ color: '#ffc107', fontWeight: 700 }}>
                      {(model.f1_score * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(61,213,152,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">R² Score</Typography>
                    <Typography variant="h6" sx={{ color: '#3dd598', fontWeight: 700 }}>
                      {model.r2_score.toFixed(4)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(155,107,255,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">RMSE</Typography>
                    <Typography variant="h6" sx={{ color: '#9b6bff', fontWeight: 700 }}>
                      {model.rmse.toFixed(4)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 1.5, background: 'rgba(255,79,183,0.1)', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary">MSE</Typography>
                    <Typography variant="h6" sx={{ color: '#ff4fb7', fontWeight: 700 }}>
                      {model.mse.toFixed(4)}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>

          {/* Train vs Test Comparison */}
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Training vs Testing Performance
          </Typography>
          
          {isClassification ? (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Train Accuracy: {(model.training_metrics.accuracy * 100).toFixed(2)}%</Typography>
                  <Typography variant="body2">Test Accuracy: {(model.test_metrics.accuracy * 100).toFixed(2)}%</Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={model.test_metrics.accuracy * 100}
                  sx={{ mt: 0.5, height: 8, background: 'rgba(255,255,255,0.1)' }}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Train R²: {model.training_metrics.r2_score.toFixed(4)}</Typography>
                  <Typography variant="body2">Test R²: {model.test_metrics.r2_score.toFixed(4)}</Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.max(0, model.test_metrics.r2_score * 100)}
                  sx={{ mt: 0.5, height: 8, background: 'rgba(255,255,255,0.1)' }}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    );
  };

  const FormulaDialog = () => (
    <Dialog open={formulaDialog} onClose={() => setFormulaDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: 'rgba(155,107,255,0.1)', fontWeight: 700 }}>
        {selectedFormula?.name}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Formula:</Typography>
            <Typography variant="body1" sx={{ p: 1.5, background: 'rgba(255,255,255,0.05)', borderRadius: 1, fontFamily: 'monospace', my: 1 }}>
              {selectedFormula?.formula}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Description:</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedFormula?.description}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Range:</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedFormula?.range}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Use Case:</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedFormula?.use_case}</Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Model Training Dashboard</Typography>
        <Chip 
          label={problemType === 'classification' ? 'Classification' : 'Regression'}
          sx={{ bgcolor: 'rgba(155,107,255,0.2)', color: '#9b6bff' }}
        />
      </Stack>

      {/* Configuration Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Data Split Configuration</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Training Set (%)"
                type="number"
                value={Math.round(trainingSplit * 100)}
                onChange={(e) => handleSplitChange(parseInt(e.target.value) / 100)}
                inputProps={{ min: 50, max: 95, step: 5 }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.04)'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Testing Set (%)"
                type="number"
                value={Math.round(testSplit * 100)}
                disabled
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.04)'
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={trainingSplit * 100}
              sx={{ height: 24, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="caption">Training: {Math.round(trainingSplit * 100)}%</Typography>
              <Typography variant="caption">Testing: {Math.round(testSplit * 100)}%</Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={trainModels}
            disabled={loading}
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.4,
              background: 'linear-gradient(135deg, #3dd598, #9b6bff)',
              boxShadow: '0 16px 40px -20px rgba(61,213,152,0.55)',
              fontWeight: 600
            }}
          >
            {loading ? 'Training Models...' : 'Train & Evaluate Models'}
          </Button>

          {loading && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress variant="determinate" value={trainingProgress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 50 }}>{trainingProgress}%</Typography>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Best Model Recommendation */}
      {bestModel && (
        <Card sx={{ mb: 3, background: 'linear-gradient(160deg, rgba(61,213,152,0.15), rgba(155,107,255,0.1))', border: '2px solid rgba(61,213,152,0.3)' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 32, color: '#3dd598' }} />
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Recommended Best Model</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#3dd598' }}>
                  {bestModel.algorithm}
                </Typography>
              </Box>
            </Stack>
            
            <Alert severity="info" icon={<InfoIcon />} sx={{ background: 'rgba(33,150,243,0.1)', borderColor: 'rgba(33,150,243,0.3)' }}>
              This model shows the best {isClassification ? 'F1 Score' : 'R² Score'} among all trained algorithms based on test data performance.
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different views */}
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.6)',
              '&.Mui-selected': {
                color: '#9b6bff'
              }
            }
          }}
        >
          <Tab label="Model Comparison" />
          <Tab label="Metrics Formulas" />
          <Tab label="Recommendations" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {models.length === 0 ? (
            <Alert severity="info">Train models to see comparison results</Alert>
          ) : (
            <Stack spacing={2}>
              {models.map((model, idx) => (
                <MetricsCard key={idx} model={model} />
              ))}
            </Stack>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Grid container spacing={2}>
          {isClassification ? (
            ['accuracy', 'precision', 'recall', 'f1_score'].map((metric) => (
              <Grid item xs={12} sm={6} key={metric}>
                <Card sx={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedFormula(metricFormulas[metric]);
                    setFormulaDialog(true);
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InfoIcon sx={{ color: '#9b6bff' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {metricFormulas[metric].name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Click to view formula
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            ['mse', 'rmse', 'r2_score'].map((metric) => (
              <Grid item xs={12} sm={6} key={metric}>
                <Card sx={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedFormula(metricFormulas[metric]);
                    setFormulaDialog(true);
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InfoIcon sx={{ color: '#9b6bff' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {metricFormulas[metric].name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Click to view formula
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recommended Algorithms</Typography>
          <Grid container spacing={2}>
            {getAlgorithmRecommendations().map((algo, idx) => (
              <Grid item xs={12} key={idx}>
                <Card sx={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {idx + 1}. {algo.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {algo.reason}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <FormulaDialog />
    </Box>
  );
};

export default ModelDashboard;
