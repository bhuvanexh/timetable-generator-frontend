import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SuccessComponent = ({ message }) => {
    const [on, setOn] = useState(false);

    useEffect(() => {
        if (message) {
            setOn(true);
        }
    }, [message]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOn(false);
    };

    return (
        <Snackbar
            open={on}
            autoHideDuration={2500}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SuccessComponent;
