import { Box, Typography } from '@mui/material'
import React from 'react'

const SubjectsIndex = () => {
    return (
        <Box>
            <Typography sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                Choose Course and Semester to start adding subjects.
            </Typography>
        </Box>
    )
}

export default SubjectsIndex