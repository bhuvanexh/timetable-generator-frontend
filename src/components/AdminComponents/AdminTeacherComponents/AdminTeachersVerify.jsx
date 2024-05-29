import React, { useState } from 'react';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getAllTeachers } from '../../../features/teachersSlice';
import { Link } from 'react-router-dom';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRef } from 'react';
import { downloadPdf } from '../../../util';

const AdminTeachersVerify = () => {
    const teachers = getAllTeachers();
    const pdfRef = useRef()
    return (
        <Box>
            <Container sx={{ marginBlock: 2 }}>
                <Box sx={{ display: "flex", paddingBlock: 1, justifyContent: "space-between", alignItems: "center" }}>

                    <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" } }}>
                        Teachers table
                    </Typography>
                    <Button variant='outlined' onClick={() => {
                        downloadPdf(pdfRef, `teachersTable`)
                    }} sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                        Download
                    </Button>
                </Box>
                <TableContainer ref={pdfRef} component={Paper}>
                    <Table aria-label="simple table" sx={{ minWidth: 550 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align='right'>Teacher's Name</TableCell>
                                <TableCell align='right'>Data Status</TableCell>
                                <TableCell align='right'>View Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teachers.map((t, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="right"> {t.name}</TableCell>
                                    <TableCell align="right" >{t.dataVerified ? "verified" : (t.isLocked ? 'submitted' : 'pending')}</TableCell>
                                    <TableCell align="right" > <Link to={`/admin/teachers/${t.id}`}>verify data <FaArrowUpRightFromSquare /></Link></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Container sx={{ marginInline: "auto", paddingBlock: 3 }}>
                <Box component={Paper} elevation={3} p={2} sx={{ maxWidth: 400, marginInline: "auto" }}>
                    <Typography variant="h6" gutterBottom>
                        Status Definitions
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                        <HourglassEmptyIcon sx={{ mr: 1 }} color="primary" />
                        <Typography variant="body1" component="div">
                            <strong>Pending:</strong> Teacher hasn't submitted or locked their data yet.
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                        <CheckCircleOutlineIcon sx={{ mr: 1 }} color="primary" />
                        <Typography variant="body1" component="div">
                            <strong>Submitted:</strong> Teacher has submitted the data but it's not yet verified by admin.
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <DoneAllIcon sx={{ mr: 1 }} color="primary" />
                        <Typography variant="body1" component="div">
                            <strong>Verified:</strong> Data is verified by admin.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminTeachersVerify;
