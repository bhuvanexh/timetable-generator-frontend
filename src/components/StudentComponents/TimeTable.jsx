import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Container, Typography } from '@mui/material';
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useRef } from 'react';


const TimeTable = ({ data }) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];

    const teachers = {};
    Object.values(data).forEach(slots => {
        Object.values(slots).forEach(slot => {
            if (slot && typeof slot !== 'string' && slot.teacher && slot.subject) {
                teachers[slot.teacher] = slot.subject;
            }
        });
    });

    const sortedTeachers = Object.keys(teachers).sort();



    return (
        <Box component="div" sx={{ paddingBottom: 10 }}>
            <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
                <Table aria-label="simple table" sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Days\Time Slots</TableCell>
                            {timeSlots.map((t, index) => (
                                <TableCell key={index} align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>{t}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daysOfWeek.map((day, rowIndex) => (
                            <TableRow key={rowIndex}>
                                <TableCell component="th" scope="row" style={{ fontWeight: 'bold', borderRight: '2px solid #000' }}>
                                    {day}
                                </TableCell>
                                {timeSlots.map((time, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        align="center"
                                        style={{ borderRight: colIndex === timeSlots.length - 1 ? 'none' : '2px solid #000' }}
                                    >
                                        {(data[day][time] && typeof data[day][time] !== "string") ?
                                            <>
                                                {data[day][time].subject} {data[day][time].type}<br />
                                                {"("}{data[day][time].teacher.split(" ").map(name => name.charAt(0)).join("").toUpperCase()}{")"}
                                            </>
                                            : '----'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <Container>
                <Typography variant='h5' sx={{ marginTop: 5 }} gutterBottom>
                    Teachers
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" sx={{ minWidth: 450 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Initials</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Full Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Subject</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedTeachers.map((teacher, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{teacher.split(" ").map(name => name.charAt(0)).join("").toUpperCase()}</TableCell>
                                    <TableCell align="center">{teacher}</TableCell>
                                    <TableCell align="center">{teachers[teacher]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    )
}

export default TimeTable;
