import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useRef } from 'react';
import { downloadPdf } from '../../../util';



const SubjectsTable = ({ subjects, deleteSubject, editStart, editDone }) => {
    const [ipValue, setIpValue] = useState('')
    // const pdfRef = useRef()
    return (
        <>
            <Box sx={{ paddingBlock: 3 }}>
                {/* <Box sx={{ display: "flex", paddingBlock: 1, justifyContent: "space-between", alignItems: "center" }}> */}
                <Typography sx={{ fontSize: { xs: "1.15rem", sm: "1.35rem", md: '1.65rem' } }} gutterBottom>
                    Subjects Table
                </Typography>
                {/* <Button variant='outlined' onClick={() => {
                        downloadPdf(pdfRef, `subjectsList`)
                    }}>
                        Download
                    </Button> */}
                {/* </Box> */}


                <TableContainer
                    // ref={pdfRef}
                    component={Paper} >
                    <Table aria-label="simple table" sx={{ minWidth: "540px" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align='right'>Subject Name</TableCell>
                                <TableCell align='right'>Edit Name</TableCell>
                                <TableCell align='right'>Delete Subject</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((s, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="right">{s.isEditing ? <input type="text" value={ipValue} onChange={(e) => setIpValue(e.target.value)} placeholder='Update Subject' /> : s.name}</TableCell>
                                    {s.isEditing ? <TableCell align="right"><MdDone style={{ cursor: "pointer" }} className='react-icon' onClick={() => editDone(ipValue, s.id)} size={18} /></TableCell> : <TableCell align="right"><FaRegEdit style={{ cursor: "pointer" }} className='react-icon' onClick={() => {
                                        setIpValue(s.name)
                                        editStart(s.id)
                                    }} size={18} /></TableCell>}
                                    <TableCell align="right" ><MdDeleteOutline style={{ cursor: "pointer" }} className='react-icon' size={18} onClick={() => deleteSubject(s.id)} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default SubjectsTable