import { Box, Typography } from '@mui/material'
import React from 'react'

const StudentIndex = () => {
    return (
        <Box component="div" sx={{ display: "flex", justifyContent: "center", marginTop: 8, padding: "2px 5px 10px" }}>
            <Typography sx={{ fontSize: { sx: "1rem", sm: "1.5rem" }, textAlign: "center" }}>
                Choose your Course, Branch and Semester to get your timetable
            </Typography>
        </Box>
    )
}

export default StudentIndex