import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ResultsVisualization = ({ metrics, visualizations, trainedModels = [], bestModel = null }) => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [formulaDialog, setFormulaDialog] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);

    // Get problem type from metrics
    const isClassification = metrics && ('accuracy' in metrics || 'f1_score' in metrics);
    const isRegression = metrics && ('mse' in metrics || 'rmse' in metrics);

    // Metric formulas
    const metricFormulas = {
        accuracy: { formula: '(TP + TN) / (TP + TN + FP + FN)', description: 'Proportion of correct predictions' },
        precision: { formula: 'TP / (TP + FP)', description: 'Proportion of positive predictions that were correct' },
        recall: { formula: 'TP / (TP + FN)', description: 'Proportion of actual positives correctly identified' },
        f1_score: { formula: '2 × (Precision × Recall) / (Precision + Recall)', description: 'Harmonic mean of precision and recall' },
        mse: { formula: '(1/n) × Σ(y_i - ŷ_i)²', description: 'Average squared difference between actual and predicted' },
        rmse: { formula: '√MSE', description: 'Square root of MSE in original units' },
        r2_score: { formula: '1 - (SS_res / SS_tot)', description: 'Proportion of variance explained' }
    };

    const showMetricFormula = (metricName) => {
        setSelectedMetric(metricName);
        setFormulaDialog(true);
    };

    // Prepare data for model comparison chart
    const comparisonData = trainedModels && trainedModels.length > 0 
        ? trainedModels.map(model => ({
            name: model.algorithm.substring(0, 12),
            fullName: model.algorithm,
            ...(isClassification && {
                accuracy: parseFloat((model.accuracy * 100).toFixed(2)),
                f1_score: parseFloat((model.f1_score * 100).toFixed(2)),
                precision: parseFloat((model.precision * 100).toFixed(2)),
                recall: parseFloat((model.recall * 100).toFixed(2))
            }),
            ...(isRegression && {
                r2: parseFloat(model.r2_score.toFixed(4)),
                rmse: parseFloat(model.rmse.toFixed(4))
            })
        }))
        : [];

    // Prepare training vs test metrics comparison
    const metricsComparisonData = metrics && metrics.training_metrics && metrics.test_metrics
        ? [
            {
                metric: 'Accuracy',
                training: isClassification ? parseFloat((metrics.training_metrics.accuracy * 100).toFixed(2)) : parseFloat(metrics.training_metrics.r2_score.toFixed(4)),
                testing: isClassification ? parseFloat((metrics.test_metrics.accuracy * 100).toFixed(2)) : parseFloat(metrics.test_metrics.r2_score.toFixed(4))
            },
            {
                metric: 'Precision',
                training: isClassification ? parseFloat((metrics.training_metrics.precision * 100).toFixed(2)) : null,
                testing: isClassification ? parseFloat((metrics.test_metrics.precision * 100).toFixed(2)) : null
            },
            {
                metric: 'Recall',
                training: isClassification ? parseFloat((metrics.training_metrics.recall * 100).toFixed(2)) : null,
                testing: isClassification ? parseFloat((metrics.test_metrics.recall * 100).toFixed(2)) : null
            }
        ].filter(d => d.training !== null)
        : [];

    const MetricBadge = ({ label, value, color, unit = '%', onClick = null }) => (
        <Box 
            onClick={onClick}
            sx={{ 
                textAlign: 'center', 
                p: 2, 
                background: `rgba(${color}, 0.1)`, 
                borderRadius: 2,
                border: `1px solid rgba(${color}, 0.3)`,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: `0 8px 16px rgba(${color}, 0.2)` } : {}
            }}
        >
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
                {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: `rgb(${color})` }}>
                {value.toFixed(unit === '%' ? 2 : 4)}{unit}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Chip 
                    icon={<CheckCircleIcon />}
                    label="Results" 
                    sx={{ bgcolor: 'rgba(61,213,152,0.18)', color: '#3dd598', borderRadius: 2 }} 
                />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Training Results & Model Evaluation</Typography>
            </Stack>

            {/* Best Model Indicator */}
            {bestModel && (
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(155,107,255,0.15), rgba(61,213,152,0.1))', border: '2px solid #9b6bff' }}>
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TrendingUpIcon sx={{ fontSize: 32, color: '#9b6bff' }} />
                            <Box>
                                <Typography variant="body2" color="textSecondary">Best Performing Model</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {bestModel.algorithm}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Best Model Metrics Display */}
            {metrics && (
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                        Model Performance Metrics
                    </Typography>
                    <Grid container spacing={2}>
                        {isClassification ? (
                            <>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="Accuracy" 
                                        value={metrics.accuracy * 100} 
                                        color="61, 213, 152"
                                        onClick={() => showMetricFormula('accuracy')}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="Precision" 
                                        value={metrics.precision * 100} 
                                        color="155, 107, 255"
                                        onClick={() => showMetricFormula('precision')}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="Recall" 
                                        value={metrics.recall * 100} 
                                        color="255, 79, 183"
                                        onClick={() => showMetricFormula('recall')}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="F1 Score" 
                                        value={metrics.f1_score * 100} 
                                        color="255, 193, 7"
                                        onClick={() => showMetricFormula('f1_score')}
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="R² Score" 
                                        value={metrics.r2_score} 
                                        color="61, 213, 152"
                                        unit=""
                                        onClick={() => showMetricFormula('r2_score')}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="RMSE" 
                                        value={metrics.rmse} 
                                        color="155, 107, 255"
                                        unit=""
                                        onClick={() => showMetricFormula('rmse')}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <MetricBadge 
                                        label="MSE" 
                                        value={metrics.mse} 
                                        color="255, 79, 183"
                                        unit=""
                                        onClick={() => showMetricFormula('mse')}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* Model Comparison Charts */}
            {comparisonData.length > 1 && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Model Comparison Bar Chart */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                {isClassification ? 'Models Accuracy Comparison' : 'Models R² Score Comparison'}
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#0a0f1c', border: '1px solid rgba(155,107,255,0.3)', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    {isClassification ? (
                                        <>
                                            <Bar dataKey="accuracy" fill="#3dd598" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="f1_score" fill="#9b6bff" radius={[8, 8, 0, 0]} />
                                        </>
                                    ) : (
                                        <Bar dataKey="r2" fill="#3dd598" radius={[8, 8, 0, 0]} />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Model Performance Radar Chart */}
                    {isClassification && comparisonData.length <= 4 && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                    Model Metrics Overview (Best Model)
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={metrics ? [{
                                        metric: 'Accuracy',
                                        value: metrics.accuracy * 100
                                    }, {
                                        metric: 'Precision',
                                        value: metrics.precision * 100
                                    }, {
                                        metric: 'Recall',
                                        value: metrics.recall * 100
                                    }, {
                                        metric: 'F1-Score',
                                        value: metrics.f1_score * 100
                                    }] : []}>
                                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                        <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(255,255,255,0.3)" />
                                        <Radar name="Score (%)" dataKey="value" stroke="#9b6bff" fill="#9b6bff" fillOpacity={0.3} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Training vs Test Metrics */}
            {metricsComparisonData.length > 0 && (
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Training vs Test Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metricsComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0a0f1c', border: '1px solid rgba(155,107,255,0.3)', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="training" stroke="#3dd598" strokeWidth={2} dot={{ fill: '#3dd598' }} />
                            <Line type="monotone" dataKey="testing" stroke="#ff4fb7" strokeWidth={2} dot={{ fill: '#ff4fb7' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            )}

            {/* All Trained Models Table */}
            {trainedModels && trainedModels.length > 0 && (
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        All Trained Models ({trainedModels.length})
                    </Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow sx={{ '& th': { fontWeight: 700, backgroundColor: 'rgba(155,107,255,0.1)' } }}>
                                    <TableCell>Algorithm</TableCell>
                                    {isClassification ? (
                                        <>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('accuracy')} style={{ cursor: 'pointer' }}>Accuracy</span></Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('precision')} style={{ cursor: 'pointer' }}>Precision</span></Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('recall')} style={{ cursor: 'pointer' }}>Recall</span></Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('f1_score')} style={{ cursor: 'pointer' }}>F1 Score</span></Tooltip>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('r2_score')} style={{ cursor: 'pointer' }}>R² Score</span></Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('rmse')} style={{ cursor: 'pointer' }}>RMSE</span></Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Click to see formula"><span onClick={() => showMetricFormula('mse')} style={{ cursor: 'pointer' }}>MSE</span></Tooltip>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainedModels.map((model, idx) => (
                                    <TableRow 
                                        key={idx}
                                        sx={{ 
                                            backgroundColor: bestModel && bestModel.algorithm === model.algorithm ? 'rgba(155,107,255,0.1)' : 'transparent',
                                            '&:hover': { backgroundColor: 'rgba(155,107,255,0.15)' },
                                            borderLeft: bestModel && bestModel.algorithm === model.algorithm ? '4px solid #9b6bff' : '4px solid transparent'
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: bestModel && bestModel.algorithm === model.algorithm ? 700 : 500 }}>
                                            {model.algorithm}
                                            {bestModel && bestModel.algorithm === model.algorithm && <Chip label="Best" size="small" sx={{ ml: 1 }} />}
                                        </TableCell>
                                        {isClassification ? (
                                            <>
                                                <TableCell align="right">{(model.accuracy * 100).toFixed(2)}%</TableCell>
                                                <TableCell align="right">{(model.precision * 100).toFixed(2)}%</TableCell>
                                                <TableCell align="right">{(model.recall * 100).toFixed(2)}%</TableCell>
                                                <TableCell align="right">{(model.f1_score * 100).toFixed(2)}%</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell align="right">{model.r2_score.toFixed(4)}</TableCell>
                                                <TableCell align="right">{model.rmse.toFixed(4)}</TableCell>
                                                <TableCell align="right">{model.mse.toFixed(4)}</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Metric Formula Dialog */}
            <Dialog open={formulaDialog} onClose={() => setFormulaDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {selectedMetric && metricFormulas[selectedMetric]?.description}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Formula:</Typography>
                        <Box sx={{ p: 2, backgroundColor: 'rgba(155,107,255,0.1)', borderRadius: 1, border: '1px solid rgba(155,107,255,0.3)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                            {selectedMetric && metricFormulas[selectedMetric]?.formula}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormulaDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ResultsVisualization;
