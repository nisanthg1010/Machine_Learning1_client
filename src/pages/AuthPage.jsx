import React, { useState, useContext } from 'react';
import { Box, Paper, Typography, Tabs, Tab, TextField, Button, Stack, Alert, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, Navigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../App';

const AuthPage = () => {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let res;
            if (mode === 'signup') {
                res = await authService.register(form);
            } else {
                res = await authService.login({ email: form.email, password: form.password });
            }
            setUser(res.data);
            navigate('/dashboard');
        } catch (err) {
            const message = err?.response?.data?.error || err?.message || 'Authentication failed';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', px: 2 }}>
            <Paper
                sx={{
                    width: '100%',
                    maxWidth: 480,
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, rgba(16,21,38,0.94), rgba(9,12,24,0.94))',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}
                elevation={0}
            >
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
                    {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', mb: 3 }}>
                    Access your experiments, datasets, and dashboards.
                </Typography>

                <Tabs
                    value={mode}
                    onChange={(_e, val) => setMode(val)}
                    variant="fullWidth"
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{ mb: 3 }}
                >
                    <Tab value="login" label="Login" />
                    <Tab value="signup" label="Sign Up" />
                </Tabs>

                <form onSubmit={onSubmit}>
                    <Stack spacing={2.2}>
                        {mode === 'signup' && (
                            <TextField
                                name="name"
                                label="Full Name"
                                value={form.name}
                                onChange={onChange}
                                required
                                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        background: 'rgba(255,255,255,0.04)'
                                    }
                                }}
                            />
                        )}
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            required
                            InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.04)'
                                }
                            }}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={onChange}
                            required
                            InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.04)'
                                }
                            }}
                        />
                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                py: 1.3,
                                borderRadius: 2,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)',
                                boxShadow: '0 16px 40px -18px rgba(255,79,183,0.7)'
                            }}
                        >
                            {loading ? (mode === 'signup' ? 'Creating...' : 'Signing in...') : (mode === 'signup' ? 'Create account' : 'Login')}
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                            sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                            {mode === 'signup' ? 'Have an account? Login' : "Need an account? Sign up"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default AuthPage;
