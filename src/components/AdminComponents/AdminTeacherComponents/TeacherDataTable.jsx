import { useState } from 'react'; // Import useState
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Container, Button, Checkbox } from '@mui/material';
import { useRef } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { deleteTeacherData, updateTeacherData } from '../../../features/teachersSlice'; // Import updateTeacherData action creator
import { checkTeacherCheckbox, downloadPdf } from '../../../util';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SuccessComponent from '../../SuccessComponent';
import ErrorComponent from '../../ErrorComponent';

const TeacherDataTable = ({ setSuccessMsg, allTeachers, adminFlag, data, teacherId, isLocked, dataVerified }) => {
    const dispatch = useDispatch();
    const pdfRef = useRef();

    const [error, setError] = useState(null)

    const handleCheckboxChange = (id, obj) => {
        if (obj.checked) {
            dispatch(updateTeacherData({ teacherId, dataId: id, body: { ...obj, checked: false } }));
        } else {
            console.log(obj, 'subj obj to be checked');
            let checkArr = checkTeacherCheckbox(allTeachers, obj)
            if (!checkArr) {
                dispatch(updateTeacherData({ teacherId, dataId: id, body: { ...obj, checked: true } }));
            } else {
                setError({ message: `${checkArr.name} is already teaching this subject in this class` })
            }
        }
    };

    console.log(data, 'hmm');


    return (
        <>
            <Box sx={{ padding: { xs: 0, sm: 2 } }}>
                <Box sx={{ display: "flex", paddingBlock: 1, justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.75rem" } }}>
                        Curriculum Overview Table
                    </Typography>
                    {isLocked &&
                        <Button onClick={() => {
                            downloadPdf(pdfRef, `curriculumOverview`)
                        }}>
                            <FileDownloadIcon />
                        </Button>
                    }
                </Box>

                <TableContainer ref={pdfRef} sx={{ marginBlock: { xs: 0, sm: 1 } }} component={Paper}>
                    <Table aria-label="simple table" sx={{ minWidth: 600 }}>
                        <TableHead sx={{ borderBottom: "2px solid black" }}>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align='right'>Course</TableCell>
                                <TableCell align='right'>Branch</TableCell>
                                <TableCell align='right'>Semester</TableCell>
                                <TableCell align='right'>Section</TableCell>
                                <TableCell align='right'>Subject</TableCell>
                                <TableCell align='right'>Lectures per Week</TableCell>
                                <TableCell align='right'>Labs per week</TableCell>
                                {!isLocked && <TableCell align='right'>Delete</TableCell>}
                                {!dataVerified && adminFlag && <TableCell align='right'>Select Data to be used</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((obj, index) => (
                                <TableRow
                                    sx={{ backgroundColor: `${!obj.checked ? "#b2b8b3" : 'white'} ` }}
                                    key={index}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="right">{obj.course}</TableCell>
                                    <TableCell align="right">{obj.branch}</TableCell>
                                    <TableCell align="right">{obj.semester}</TableCell>
                                    <TableCell align="right">{obj.section}</TableCell>
                                    <TableCell align="right">{obj.subject}</TableCell>
                                    <TableCell align="right">{obj.lectures}</TableCell>
                                    <TableCell align="right">{obj.labs}</TableCell>
                                    {!isLocked && (
                                        <TableCell align="right">
                                            <MdDeleteOutline
                                                className='react-icon'
                                                onClick={async () => {
                                                    let res = await dispatch(deleteTeacherData({ teacherId, dataId: obj.id }))
                                                    if (res.meta.requestStatus == 'fulfilled') {
                                                        setSuccessMsg('data deleted')
                                                    } else if (res.meta.requestStatus == 'rejected') {
                                                        setSuccessMsg(res.payload.message || "couldn't delete data")
                                                    }
                                                }
                                                }
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </TableCell>
                                    )}
                                    {!dataVerified && adminFlag && <TableCell align="right">
                                        <Checkbox
                                            checked={obj.checked || false}
                                            onChange={() => handleCheckboxChange(obj.id, obj)}
                                        />
                                    </TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {error && <ErrorComponent error={error} />}
        </>
    );
}

export default TeacherDataTable;
