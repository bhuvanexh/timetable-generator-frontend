import { Box, Button, Container, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getTimetable } from '../../features/timetablesSlice'
import TimeTable from './TimeTable'
import { downloadPdf } from '../../util'
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const StudentTimetable = () => {
    const { course, branch, semester, section } = useParams()
    const timetable = getTimetable(course, branch, semester, section)
    const pdfRef = useRef()


    return (
        <>
            {
                timetable
                &&
                <Box component="div" sx={{ paddingTop: 3 }}>
                    <Container >
                        <Box sx={{ display: "flex", paddingBlock: 1, justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "2rem" } }}>
                                Student's Timetable for {course} {branch}, {semester} semester
                            </Typography>
                            <Button onClick={() => {
                                downloadPdf(pdfRef, `timetable${course}_${semester}sem`)
                            }}>
                                <FileDownloadIcon />
                            </Button>
                        </Box>
                        <Box ref={pdfRef}>
                            <TimeTable data={timetable} />
                        </Box>
                    </Container>
                </Box>
            }
        </>
    )
}

export default StudentTimetable