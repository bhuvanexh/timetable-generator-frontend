import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const TeacherForm = ({ addTeacher, error, setError }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = () => {
        if (name && email && password) {
            addTeacher(name, email, password);
            setName('');
            setEmail('');
            setPassword('');
        } else {
            setError('complete entries')
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    return (
        <Box>
            <Box sx={{ boxShadow: "2px 2px 10px", width: { xs: "90%", sm: "80%", md: "70%" }, borderRadius: 4, bgcolor: "white", padding: 3, display: "flex", flexDirection: "column", gap: 2, alignItems: "center", marginInline: "auto" }}>
                <TextField
                    type="text"
                    label="Teacher's name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mb: 1 }}
                    error={error != ''}
                    helperText={error}
                />
                <TextField
                    type="email"
                    label="Teacher's email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 1 }}
                    error={error != ''}
                    helperText={error}
                />
                <TextField
                    type="password"
                    label="Teacher's password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />
            </Box>
            <Button sx={{ display: "block", width: "150px", fontSize: "1rem", marginInline: "auto", marginTop: 3 }} onClick={handleClick} variant="contained" color="primary">Add Teacher</Button>
        </Box>
    );
};

export default TeacherForm;
