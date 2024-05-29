import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from '@mui/material';
import { useRef } from 'react';
import { downloadPdf } from '../../../util';

const TimetablesComponent = ({ timetables, parameters }) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30"];
    // const courses = ["BTech", "MTech"];
    // const semesters = {
    //     BTech: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"],
    //     MTech: ["first", "second", "third", "fourth"]
    // };
    const pdfRef = useRef()
    console.log(timetables, 'timetables from component', parameters);

    return (
        <Box>
            <Typography sx={{ width: "max-content", fontSize: { xs: "1.45rem", sm: "1.65rem", md: "1.8rem" }, borderBottom: "1px solid black" }} gutterBottom >
                All Timetables
            </Typography>
            <Box sx={{ paddingBlock: { xs: 1, sm: 2, md: 3 } }}>
                {parameters.map(p => (
                    p.branches.map(branch => (
                        [...Array(Number(p.semesters))].map((_, index) => (
                            [...Array(Number(branch.sections))].map((_, i) => (
                                <Box key={i} sx={{ marginBottom: 4 }} className='time-table-wrapper'>
                                    <Box sx={{ display: "flex", paddingBlock: 1, justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.45rem", md: "1.6rem" } }} >
                                            Timetable for {branch.name} {p.course} - {index + 1} semester section {i + 1}
                                        </Typography>
                                        <Button variant='outlined' onClick={() => {
                                            downloadPdf(pdfRef, `timetable${course}_${sem}sem`)
                                        }} sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                                            Download
                                        </Button>
                                    </Box>
                                    <TableContainer ref={pdfRef} component={Paper}>
                                        <Table aria-label="timetable table" sx={{ minWidth: 650 }}>
                                            <TableHead sx={{ borderBottom: "2px solid black" }}>
                                                <TableRow>
                                                    <TableCell align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>Days\Time Slots</TableCell>
                                                    {timeSlots.map((t, index) => (
                                                        <TableCell key={index} align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>{t}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {daysOfWeek.map((day, j) => (
                                                    <TableRow key={j}>
                                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold', borderRight: '2px solid #000' }}>
                                                            {day}
                                                        </TableCell>
                                                        {timeSlots.map((t, j2) => (
                                                            <TableCell key={j2}
                                                                style={{ borderRight: j2 === timeSlots.length - 1 ? 'none' : '2px solid #000' }}
                                                                align="center"
                                                            >
                                                                {(timetables[p.course][branch.name][index + 1][i + 1][day][t] && typeof timetables[p.course][branch.name][index + 1][i + 1][day][t] !== 'string') ?
                                                                    `${timetables[p.course][branch.name][index + 1][i + 1][day][t].subject} ${timetables[p.course][branch.name][index + 1][i + 1][day][t].type} by ${timetables[p.course][branch.name][index + 1][i + 1][day][t].teacher}` :
                                                                    // `${timetables[p.course][branch.name][index + 1][i + 1][day][t]}`
                                                                    "--"
                                                                }
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                            ))
                        ))
                    ))
                ))
                }
            </Box>
        </Box>
    );
}

export default TimetablesComponent;
