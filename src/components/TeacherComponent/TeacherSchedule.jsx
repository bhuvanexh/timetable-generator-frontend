import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { getCurrTeacher, getTeachersError } from '../../features/teachersSlice'
import { downloadPdf } from '../../util'
import ErrorComponent from '../ErrorComponent'
import Loading from '../Loading'

const TeacherSchedule = () => {
    const currTeacher = getCurrTeacher()
    const pdfRef = useRef()
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];
    // const teacherError = getTeachersError()
    return (
        <>
            {currTeacher ?
                <Box>
                    <Box sx={{ display: "flex", paddingBlock: 2, justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.6rem" } }} >
                            Schedule for {currTeacher.teacher.name}
                        </Typography>
                        <Button variant='outlined' onClick={() => {
                            downloadPdf(pdfRef, `timetable${course}_${sem}sem`)
                        }} sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                            Download
                        </Button>
                    </Box>
                    {Object.entries(currTeacher.teacher.teacherSchedule).length > 0 &&
                        <TableContainer ref={pdfRef} component={Paper}>
                            <Table aria-label="schedule table" sx={{ minWidth: 650 }}>
                                <TableHead sx={{ borderBottom: "2px solid black" }}>
                                    <TableRow>
                                        <TableCell align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Days\Time Slots</TableCell>
                                        {timeSlots.map((t, index) => (
                                            <TableCell key={index} align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>{t}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {daysOfWeek.map((day, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" style={{ fontWeight: 'bold', borderRight: '2px solid #000' }}>
                                                {day}
                                            </TableCell>
                                            {timeSlots.map((t, index2) => (
                                                <TableCell key={index2}
                                                    style={{ borderRight: index2 === timeSlots.length - 1 ? 'none' : '2px solid #000' }}
                                                    align="center"
                                                >
                                                    {(currTeacher.teacher.teacherSchedule[day][t] && typeof currTeacher.teacher.teacherSchedule[day][t] !== 'string') ?
                                                        `${currTeacher.teacher.teacherSchedule[day][t].subject} ${currTeacher.teacher.teacherSchedule[day][t].type} in ${currTeacher.teacher.teacherSchedule[day][t].course} ${currTeacher.teacher.teacherSchedule[day][t].semester} sem` :
                                                        `${currTeacher.teacher.teacherSchedule[day][t]}`
                                                    }
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Box> :
                <Loading />
            }
            {/* {teacherError && <ErrorComponent error={teacherError} />} */}
        </>
    )
}

export default TeacherSchedule