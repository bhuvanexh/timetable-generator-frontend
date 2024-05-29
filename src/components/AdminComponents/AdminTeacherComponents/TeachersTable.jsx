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
import { Box, Container, Typography } from '@mui/material';



const TeachersTable = ({ teachers, deleteTeacher, editStart, editDone }) => {
    const [ipValue, setIpValue] = useState('')
    return (
        <>
            <Container sx={{ marginBlock: 4 }}>
                <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" } }} gutterBottom>
                    Teachers table
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" sx={{ minWidth: "550px" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align='right'>Teacher's Name</TableCell>
                                <TableCell align='right'>Edit Name</TableCell>
                                {/* <TableCell align='right'>Data Status</TableCell> */}
                                {/* <TableCell align='right'>View Data</TableCell> */}
                                <TableCell align='right'>Delete Teacher</TableCell>
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
                                    <TableCell align="right">{t.isEditing ? <input type="text" value={ipValue} onChange={(e) => setIpValue(e.target.value)} placeholder='Update name' /> : t.name}</TableCell>
                                    {t.isEditing ? <TableCell align="right"><MdDone style={{ cursor: "pointer" }} className='react-icon' onClick={() => editDone(ipValue, t.id)} size={18} /></TableCell> : <TableCell align="right"><FaRegEdit style={{ cursor: "pointer" }} className='react-icon' onClick={() => {
                                        setIpValue(t.name)
                                        editStart(t.id)
                                    }} size={18} /></TableCell>}
                                    {/* <TableCell align="right" >{t.dataVerified ? "verified" : (t.isLocked ? 'submitted' : 'pending')}</TableCell> */}
                                    {/* <TableCell align="right" > <Link to={`/admin/teachers/${t.id}`}>data</Link></TableCell> */}
                                    <TableCell align="right" ><MdDeleteOutline style={{ cursor: "pointer" }} className='react-icon' size={18} onClick={() => deleteTeacher(t.id)} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}

export default TeachersTable