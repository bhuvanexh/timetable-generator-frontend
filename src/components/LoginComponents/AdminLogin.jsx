import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography, Link, Grid, CircularProgress } from "@mui/material";
import { adminLogin } from "../../features/teachersSlice";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const dispatch = useDispatch();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await dispatch(adminLogin({ email, password }));
        setLoading(false);
        if (res.payload.msg) {
            setMsg(res.payload.msg);
            setTimeout(() => {
                setMsg(null);
            }, 3000);
        } else {
            navigate('/admin', { replace: true });
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ paddingBlock: 10 }}>
            <Typography component="h1" variant="h5">
                Admin Login
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mt: 3, mb: 2, paddingBlock: 1 }}
                >
                    {loading ? <CircularProgress color="inherit" size={24} /> : "Sign In"}
                </Button>
                {msg && <Typography variant="body2" color="error">{msg}</Typography>}
            </form>
        </Container>
    );
}
