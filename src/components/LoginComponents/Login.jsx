import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography, Link, Grid, CircularProgress } from "@mui/material";
import { teacherLogin } from "../../features/teachersSlice";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const dispatch = useDispatch();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await dispatch(teacherLogin({ email, password }));
        setLoading(false);
        if (res.payload.msg) {
            setMsg(res.payload.msg);
            setTimeout(() => {
                setMsg(null);
            }, 3000);
        } else {
            navigate('/teacher', { replace: true });
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ paddingBlock: 10 }}>
            <Typography sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}>
                Sign in to your account
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
                    sx={{ mt: 3, mb: 2, paddingBlock: { xs: 1, sm: 2 } }}
                >
                    {loading ? <CircularProgress color="inherit" size={24} /> : "Sign In"}
                </Button>
                {msg && <Typography variant="body2" color="error">{msg}</Typography>}
            </form>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link component={RouterLink} to="/login/admin" variant="body2">
                        Login as admin
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
}
