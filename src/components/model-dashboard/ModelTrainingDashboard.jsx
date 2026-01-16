import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Slider, TextField, Typography, Chip, LinearProgress, Paper, Alert } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import experimentService from '../../services/experimentService';

const ModelTrainingDashboard = ({ dataset, problemType, onTrainingComplete }) => {
  const [testSize, setTestSize] = useState(0.2);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [training, setTraining] = useState(false);
  const [results, setResults] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const algorithmsByProblem = {
    classification: [
      'logistic_regression', 'random_forest_classifier', 'gradient_boosting_classifier',
      'svm_classifier', 'knn_classifier', 'gaussian_nb'
    ],
    regression: [
      'linear_regression', 'random_forest_regressor', 'gradient_boosting_regressor',
      'svm_regressor', 'knn_regressor', 'ridge_regression'
    ],
    clustering: [
      'kmeans', 'hierarchical', 'dbscan', 'gaussian_mixture'
    ]
  };

  const availableAlgorithms = algorithmsByProblem[problemType] || [];

  const toggleAlgorithm = (algo) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algo) ? prev.filter(a => a !== algo) : [...prev, algo]
    );
  };

  const handleTraining = async () => {
    if (selectedAlgorithms.length === 0) {
      alert('Please select at least one algorithm');
      return;
    }

    setTraining(true);
    setResults(null);

    try {
      const trainingData = {
        datasetId: dataset._id,
        algorithms: selectedAlgorithms,
        testSize: testSize,
        problemType: problemType
      };

      const response = await experimentService.trainMultipleModels(trainingData);
      setResults(response);
      setTrainingProgress(100);
      onTrainingComplete?.(response);
    } catch (error) {
      console.error('Training error:', error);
      alert('Training failed: ' + error.message);
    } finally {
      setTraining(false);
    }
  };

  const getMetricsForAlgorithm = (algo, results) => {
    if (!results[algo]) return null;
    const metrics = results[algo].training_metrics;
    return metrics;
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ width: '100%', py: 3 }}>
        {/* Configuration Section */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(160deg, rgba(155,107,255,0.1), rgba(255,79,183,0.05))',
              border: '1px solid rgba(155,107,255,0.2)',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ color: '#9b6bff', fontWeight: 700, mb: 2 }}>
              Training Configuration
            </Typography>

            {/* Test Size Slider */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ color: 'white' }}>Train/Test Split</Typography>
                <Typography sx={{ color: '#3dd598', fontWeight: 'bold' }}>
                  Train: {Math.round((1 - testSize) * 100)}% | Test: {Math.round(testSize * 100)}%
                </Typography>
              </Box>
              <Slider
                value={testSize}
                onChange={(e, val) => setTestSize(val)}
                min={0.1}
                max={0.5}
                step={0.05}
                sx={{
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)',
                    boxShadow: '0 4px 20px rgba(255,79,183,0.5)'
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)'
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, display: 'block' }}>
                Adjust the split ratio. Lower values give more data to training, higher values to testing.
              </Typography>
            </Box>

            {/* Algorithm Selection */}
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                Select Algorithms to Train ({selectedAlgorithms.length}/{availableAlgorithms.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {availableAlgorithms.map(algo => (
                  <motion.div key={algo} whileHover={{ scale: 1.05 }}>
                    <Chip
                      label={algo.replace(/_/g, ' ').toUpperCase()}
                      onClick={() => toggleAlgorithm(algo)}
                      sx={{
                        background: selectedAlgorithms.includes(algo)
                          ? 'linear-gradient(135deg, #9b6bff, #ff4fb7)'
                          : 'rgba(155,107,255,0.2)',
                        color: selectedAlgorithms.includes(algo) ? 'white' : 'rgba(255,255,255,0.7)',
                        fontWeight: 600,
                        border: '2px solid',
                        borderColor: selectedAlgorithms.includes(algo)
                          ? 'rgba(155,107,255,0.8)'
                          : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Train Button */}
            <Button
              variant="contained"
              onClick={handleTraining}
              disabled={training || selectedAlgorithms.length === 0}
              sx={{
                mt: 3,
                width: '100%',
                py: 1.5,
                background: 'linear-gradient(135deg, #3dd598, #9b6bff)',
                boxShadow: '0 8px 32px rgba(61,213,152,0.4)',
                fontWeight: 700,
                fontSize: '16px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(61,213,152,0.6)'
                }
              }}
            >
              {training ? `Training... ${trainingProgress}%` : 'Start Training'}
            </Button>

            {training && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <LinearProgress
                  variant="determinate"
                  value={trainingProgress}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(155,107,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #3dd598, #9b6bff)',
                      borderRadius: 4
                    }
                  }}
                />
              </motion.div>
            )}
          </Paper>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div variants={itemVariants}>
            <Box>
              <Typography variant="h6" sx={{ color: '#3dd598', fontWeight: 700, mb: 2 }}>
                Training Results
              </Typography>

              {/* Best Model Alert */}
              {results.bestModel && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    background: 'rgba(61,213,152,0.15)',
                    border: '1px solid rgba(61,213,152,0.4)',
                    color: '#3dd598'
                  }}
                >
                  <strong>Best Model: {results.bestModel.algorithm.toUpperCase()}</strong>
                  <br />
                  Score: {(results.bestModel.score * 100).toFixed(2)}%
                </Alert>
              )}

              {/* Models Comparison Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(results).map(([algo, metrics]) => {
                  if (algo === 'bestModel') return null;
                  if (!metrics.training_metrics) return null;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={algo}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            background: 'rgba(155,107,255,0.08)',
                            border: '1px solid rgba(155,107,255,0.2)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 8px 32px rgba(155,107,255,0.2)',
                              transform: 'translateY(-4px)'
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" sx={{ color: '#9b6bff', fontWeight: 700, mb: 2 }}>
                              {algo.replace(/_/g, ' ').toUpperCase()}
                            </Typography>

                            {/* Metrics Display */}
                            {problemType === 'classification' ? (
                              <>
                                <MetricDisplay
                                  label="Accuracy"
                                  value={metrics.training_metrics.accuracy}
                                  color="#3dd598"
                                />
                                <MetricDisplay
                                  label="Precision"
                                  value={metrics.training_metrics.precision}
                                  color="#ff4fb7"
                                />
                                <MetricDisplay
                                  label="Recall"
                                  value={metrics.training_metrics.recall}
                                  color="#ffa726"
                                />
                                <MetricDisplay
                                  label="F1-Score"
                                  value={metrics.training_metrics.f1_score}
                                  color="#9b6bff"
                                />
                              </>
                            ) : (
                              <>
                                <MetricDisplay
                                  label="MSE"
                                  value={metrics.training_metrics.mse}
                                  color="#3dd598"
                                />
                                <MetricDisplay
                                  label="RMSE"
                                  value={metrics.training_metrics.rmse}
                                  color="#ff4fb7"
                                />
                                <MetricDisplay
                                  label="R² Score"
                                  value={metrics.training_metrics.r2_score}
                                  color="#9b6bff"
                                />
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Performance Comparison Chart */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      background: 'rgba(155,107,255,0.08)',
                      border: '1px solid rgba(155,107,255,0.2)',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#9b6bff', fontWeight: 700, mb: 2 }}>
                      Models Performance Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Object.entries(results)
                          .filter(([k]) => k !== 'bestModel')
                          .map(([algo, metrics]) => ({
                            name: algo.replace(/_/g, ' '),
                            accuracy: problemType === 'classification' 
                              ? (metrics.training_metrics?.accuracy * 100).toFixed(2)
                              : (metrics.training_metrics?.r2_score * 100).toFixed(2)
                          }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                        <YAxis stroke="rgba(255,255,255,0.6)" />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(155,107,255,0.5)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="accuracy" fill="url(#gradient)" radius={8} />
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9b6bff" />
                            <stop offset="100%" stopColor="#ff4fb7" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </motion.div>
              )}
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

const MetricDisplay = ({ label, value, color }) => (
  <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: color,
        fontWeight: 700,
        fontSize: '16px'
      }}
    >
      {typeof value === 'number' ? value.toFixed(4) : value}
    </Typography>
  </Box>
);

export default ModelTrainingDashboard;
