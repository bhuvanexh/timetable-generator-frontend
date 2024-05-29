import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { editTeacher, getCurrTeacher } from '../../features/teachersSlice';

const TeacherPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const currTeacher = getCurrTeacher()


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async () => {
        if (password.length < 6) {
            setError('Password should be atleast 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        let res = await dispatch(editTeacher({ id: currTeacher.id, newData: { password } }));
        if (res.payload?.id) {
            navigate('/')
        }
    };

    return (
        <Box maxWidth="400px" mx="auto" mt={5} p={3}>
            <Typography variant="h5" gutterBottom>
                Reset Password
            </Typography>
            <TextField
                label="New Password"
                type="password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                margin="normal"
                variant="outlined"
                error={error !== ''}
                helperText={error}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                mt={3}
            >
                Reset Password
            </Button>
        </Box>
    );
};

export default TeacherPassword;
