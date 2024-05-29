import { Box, Button, Container, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HintBox = () => {
    const navigate = useNavigate();
    return (
        <Container sx={{ bgcolor: '#f6f6f6', maxWidth: "max-content", p: 3, borderRadius: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <Box sx={{ display: "flex", borderBottom: "1px solid grey", paddingBottom: 3, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: { xs: 1, sm: 3, md: 5 }, alignItems: "center" }}>
                <Box>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: { xs: "center", md: "start" }, alignItems: 'center', fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        <AssignmentIcon sx={{ marginRight: '8px' }} />
                        Add all parameters and configurations
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ textAlign: { xs: "center", md: "start" } }}>
                        Add courses, branches and their respective number of semesters.
                    </Typography>
                </Box>
                <Button variant='contained' onClick={() => navigate('/admin/parameters')}>Parameters</Button>
            </Box>
            <Box sx={{ display: "flex", borderBottom: "1px solid grey", paddingBottom: 3, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: { xs: 1, sm: 3, md: 5 }, alignItems: "center", marginTop: 4 }}>
                <Box>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: { xs: "center", md: "start" }, alignItems: 'center', fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        <AssignmentIcon sx={{ marginRight: '8px' }} />
                        Fill Subject Data First
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ textAlign: { xs: "center", md: "start" } }}>
                        Make sure to add subjects to each course and semester.
                    </Typography>
                </Box>
                <Button variant='contained' onClick={() => navigate('/admin/subjects')}>Subjects List</Button>
            </Box>

            <Box sx={{ display: "flex", borderBottom: "1px solid grey", paddingBottom: 3, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: { xs: 1, sm: 3, md: 5 }, alignItems: "center", marginTop: 4 }}>
                <Box>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: { xs: "center", md: "start" }, alignItems: 'center', fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        <PersonAddIcon sx={{ marginRight: '8px' }} />
                        Add All Teachers
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ textAlign: { xs: "center", md: "start" } }}>
                        Add all teachers to the list.
                    </Typography>
                </Box>
                <Button variant='contained' onClick={() => navigate('/admin/teachers')}>Teachers List</Button>
            </Box>

            <Box sx={{ display: "flex", borderBottom: "1px solid grey", paddingBottom: 3, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: { xs: 1, sm: 3, md: 5 }, alignItems: "center", marginTop: 4 }}>
                <Box>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: { xs: "center", md: "start" }, alignItems: 'center', fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        <CheckCircleIcon sx={{ marginRight: '8px' }} />
                        Verify Data
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ textAlign: { xs: "center", md: "start" } }}>
                        After all teachers submit their data, verify it.
                    </Typography>
                </Box>
                <Button variant='contained' onClick={() => navigate('/admin/teachers/verify')}>Verify Data</Button>
            </Box>

            <Box sx={{ display: "flex", paddingBottom: 3, flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: { xs: 1, sm: 3, md: 5 }, alignItems: "center", marginTop: 4 }}>
                <Box>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: { xs: "center", md: "start" }, alignItems: 'center', fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        <EventNoteIcon sx={{ marginRight: '8px' }} />
                        Generate Timetables
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: { xs: "center", md: "start" } }}>
                        Once all data is verified, proceed to generate timetables.
                    </Typography>
                </Box>
                <Button variant='contained' onClick={() => navigate('/admin/timetables')}>TimeTables</Button>
            </Box>
        </Container>
    );
}

const AdminIndex = () => {
    return (
        <Box sx={{ paddingBlock: 7, paddingInline: 2 }}>
            <Typography sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, textAlign: "center", marginBottom: 4 }}>
                Welcome Admin👋, a short roadmap for assistance
            </Typography>
            <HintBox />
        </Box>
    );
}

export default AdminIndex;
