import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const SubjectForm = ({ addSubject, error }) => {
    const [value, setValue] = useState('');
    const handleClick = () => {
        if (value) {
            addSubject(value);
            setValue('');
        }
    };
    return (
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, marginBlock: { xs: "15px 5px", md: "25px 10px" }, gap: { xs: 2, sm: 2, md: 4 } }}>
            <TextField
                fullWidth
                label="Subject's name"
                variant="outlined"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={error != ''}
                helperText={error}
            />
            <Box
                sx={{ display: "block", alignSelf: 'center', height: 45 }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    disabled={!value}
                    sx={{ height: '100%', width: 160 }}
                >
                    Add Subject
                </Button>
            </Box>
        </Box>
    );
}

export default SubjectForm;
