import { Box, IconButton } from '@mui/material'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminTeachers = () => {
    return (
        <Box>
            <Link to=".." relative="path">
                <IconButton sx={{ mb: 2, display: "flex" }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <Outlet />
        </Box>
    )
}

export default AdminTeachers