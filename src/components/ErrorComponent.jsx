import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ErrorComponent = ({ error }) => {
    const [on, setOn] = useState(false);

    console.log('error rendered', error);

    useEffect(() => {
        if (error) {
            setOn(true);
        }
    }, [error]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOn(false);
    };

    return (
        <Snackbar
            open={on}
            autoHideDuration={3500}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                {error.message}
            </Alert>
        </Snackbar>
    );
};

export default ErrorComponent;
