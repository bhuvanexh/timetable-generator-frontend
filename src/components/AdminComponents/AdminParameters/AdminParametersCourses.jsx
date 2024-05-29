import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { addParameter, deleteParameter } from '../../../features/parametersSlice';
import SuccessComponent from '../../SuccessComponent';

const AdminParametersCourses = ({ parameters, setSuccessMsg }) => {
    const [name, setName] = useState('');
    const [numSemesters, setNumSemesters] = useState(1);

    const dispatch = useDispatch()
    const [error, setError] = useState('')


    const handleClick = async () => {
        if (name.length > 1) {
            let parameterCheckArr = parameters.filter(p => p.course.toLowerCase() == name.toLowerCase());
            if (parameterCheckArr.length > 0) {
                setError('course already exists');
                setTimeout(() => {
                    setError('');
                }, 3000);
            } else {
                let res = await dispatch(addParameter({ course: name, semesters: numSemesters }));
                if (res.meta.requestStatus == 'fulfilled') {
                    setSuccessMsg('parameter added')
                } else if (res.meta.requestStatus == 'rejected') {
                    setSuccessMsg(res.payload.message || "couldn't add parameter")
                }
                setName('')
                setNumSemesters(1)
            }
        } else {
            setError('enter course name');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };
    const handleDelete = async (course) => {
        let res = await dispatch(deleteParameter({ course }))
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('parameter deleted')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't delete parameter")
        }
    };

    return (
        <>
            <Box paddingBlock={3}>
                <Box sx={{ display: "flex", gap: 2, flexDirection: { sm: 'row', xs: "column" } }}>
                    <Box width={{ sm: '40%', xs: '100%' }}>
                        <TextField
                            type="text"
                            label="Enter Course Title"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={error !== ''}
                            helperText={error}
                            fullWidth
                        />
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} gap={2}>
                        <TextField
                            select
                            label="No. of Semesters"
                            variant="outlined"
                            value={numSemesters}
                            onChange={(e) => setNumSemesters(e.target.value)}
                            sx={{ width: { sm: '200px', xs: '120px' } }}
                        >
                            {[...Array(8)].map((_, index) => (
                                <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                            ))}
                        </TextField>
                        <Box>
                            <Button
                                sx={{ display: "block", fontSize: { sm: "14px", xs: "12px" }, height: '55px' }}
                                onClick={handleClick}
                                variant="contained"
                                color="primary"
                            >
                                Add Course
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                        <Table aria-label="simple table" sx={{ minWidth: "550px" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell align='right'>Course Title</TableCell>
                                    <TableCell align='right'>No. of Semesters</TableCell>
                                    <TableCell align='right'>Delete Course</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {parameters.map((p, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="right">{p.course}</TableCell>
                                        <TableCell align="right">{p.semesters}</TableCell>
                                        <TableCell align="right" ><MdDeleteOutline style={{ cursor: "pointer" }} className='react-icon' size={18} onClick={() => handleDelete(p.course)} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
};

export default AdminParametersCourses;