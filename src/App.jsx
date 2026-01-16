import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Container, Box, Typography, Paper, Button, Grid, Card, CardContent, CircularProgress, Chip, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Alert, Dialog, DialogTitle, DialogContent, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LandingPage from './pages/LandingPage';
import ExperimentWizard from './components/problem-definition/ExperimentWizard';
import MLProcessPage from './pages/MLProcessPage';
import PreprocessingGuidePage from './pages/PreprocessingGuidePage';
import TrainingGuidePage from './pages/TrainingGuidePage';
import Layout from './components/common/Layout';
import AuthPage from './pages/AuthPage';
import MLCategoryPage from './pages/MLCategoryPage';
import MLWorkflowPage from './pages/MLWorkflowPage';
import './styles/animations.css';

// Create Context for sharing model data
export const ModelContext = React.createContext();
export const AuthContext = React.createContext();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#9b6bff',
            light: '#c6a4ff',
            dark: '#7a4fd1',
        },
        secondary: {
            main: '#ff4fb7',
        },
        background: {
            default: 'transparent',
            paper: 'rgba(14, 18, 33, 0.9)',
        },
        text: {
            primary: '#f8fbff',
            secondary: 'rgba(248, 251, 255, 0.72)',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontWeight: 800, letterSpacing: '-0.02em' },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { fontWeight: 700 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backdropFilter: 'blur(14px)',
                    backgroundColor: 'rgba(14,18,33,0.9)',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                },
                contained: {
                    boxShadow: '0 10px 30px -14px rgba(155,107,255,0.6)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 18,
                    background: 'rgba(16, 21, 38, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                }
            }
        }
    },
});

function App() {
    const [latestModel, setLatestModel] = React.useState(null);
    const [user, setUser] = React.useState(() => {
        const cached = localStorage.getItem('user');
        return cached ? JSON.parse(cached) : null;
    });

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    React.useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthContext.Provider value={{ user, setUser, logout }}>
                <ModelContext.Provider value={{ latestModel, setLatestModel }}>
                    <Router>
                        <Layout>
                            <Routes>
                                <Route path="/login" element={<AuthPage />} />
                                <Route path="/categories" element={<MLCategoryPage />} />
                                <Route path="/workflow/:category" element={<MLWorkflowPage />} />
                                <Route path="/experiment" element={<ExperimentWizard />} />
                                <Route path="/ml-process" element={<MLProcessPage />} />
                                <Route path="/preprocessing" element={<PreprocessingGuidePage />} />
                                <Route path="/training-guide" element={<TrainingGuidePage />} />
                                <Route path="/" element={user ? <MLCategoryPage /> : <AuthPage />} />
                            </Routes>
                        </Layout>
                    </Router>
                </ModelContext.Provider>
            </AuthContext.Provider>
        </ThemeProvider>
    )
}

export default App
