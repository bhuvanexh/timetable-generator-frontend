import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Loading = () => {
    return (
        <Box sx={{ position: "absolute", zIndex: 100000, top: 0, height: "100vh", width: '100%', display: "flex", padding: 4, alignItems: "center", justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )
}

export default Loading