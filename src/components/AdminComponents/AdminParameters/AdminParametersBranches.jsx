import React, { useState } from 'react';
import { Box, Button, Paper, TextField, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { addBranch, deleteBranch, getAllParameters } from '../../../features/parametersSlice';
import { useDispatch } from 'react-redux';
import { MdDeleteOutline } from 'react-icons/md';

const AdminParametersBranches = ({ parameters, setSuccessMsg }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [branchName, setBranchName] = useState('');
    const [numSections, setNumSections] = useState(1);

    const [error, setError] = useState('')


    const dispatch = useDispatch()
    const handleAddBranch = async () => {
        if (selectedCourse == '' || branchName == '' || numSections == '') {
            setError('complete all entries');
            setTimeout(() => {
                setError('');
            }, 3000);
        } else if (selectedCourse) {
            console.log('rannnn');
            let paramCheckarr = parameters.filter(p => {
                if (p.course == selectedCourse) {
                    return p.branches.some(b => b.name.toLowerCase() == branchName.toLowerCase())
                } else {
                    return false
                }
            })
            if (paramCheckarr.length > 0) {
                setError('branch already exist');
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
            else {
                let res = await dispatch(addBranch({ course: selectedCourse, body: { name: branchName, sections: numSections } }))
                if (res.meta.requestStatus == 'fulfilled') {
                    setSuccessMsg('branch added')
                } else if (res.meta.requestStatus == 'rejected') {
                    setSuccessMsg(res.payload.message || "couldn't add parameter")
                }
            }
        }
    };

    async function handleBranchDelete(course, branch) {
        let res = await dispatch(deleteBranch({ course, branch }))
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('branch deleted')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't delete parameter")
        }
    }

    let displayElarr = []

    let count = 0
    parameters.map((p, i) => {
        p.branches.map((b, index) => {
            count++
            let element =
                (
                    <TableRow
                        key={`${b.name + p.course}`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {count}
                        </TableCell>
                        <TableCell align="right">{b.name}</TableCell>
                        <TableCell align="right">{b.sections}</TableCell>
                        <TableCell align="right">{p.course}</TableCell>
                        <TableCell align="right" ><MdDeleteOutline style={{ cursor: "pointer" }} className='react-icon' size={18} onClick={() => handleBranchDelete(p.course, b.name)} /></TableCell>
                    </TableRow>
                )
            displayElarr.push(element)
        })
    })

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: { xs: 3, md: 2 }, maxWidth: '850px', marginInline: 'auto', paddingBlock: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box flexGrow={1} maxWidth={500}>
                    <TextField
                        select
                        label="Select Course"
                        variant="outlined"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        error={error !== ''}
                        helperText={error}
                        fullWidth
                    >
                        {parameters.map((p, index) => (
                            <MenuItem key={index} value={p.course}>{p.course}</MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box flexGrow={1} maxWidth={500}>
                    <TextField
                        type="text"
                        label="Enter Branch Name"
                        variant="outlined"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        error={error !== ''}
                        helperText={error}
                        fullWidth
                    />
                </Box>
                <Box display={'flex'} gap={2} alignSelf={'center'}>
                    <TextField
                        select
                        label="No. of Sections"
                        variant="outlined"
                        value={numSections}
                        onChange={(e) => setNumSections(e.target.value)}
                        sx={{ width: { xs: '150px' } }}
                    >
                        {[...Array(3)].map((_, index) => (
                            <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                        ))}
                    </TextField>
                    <Box
                        sx={{ display: "block", width: '150px' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddBranch}
                            fullWidth
                            sx={{ fontSize: "14px", height: '55px' }}
                        >
                            Add Branch
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
                                <TableCell align='right'>Branch</TableCell>
                                <TableCell align='right'>Sections</TableCell>
                                <TableCell align='right'>Course</TableCell>
                                <TableCell align='right'>Delete Branch</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {...displayElarr}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AdminParametersBranches;
