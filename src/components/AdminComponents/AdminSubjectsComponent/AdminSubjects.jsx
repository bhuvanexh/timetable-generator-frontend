import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAllParameters } from '../../../features/parametersSlice';
import Loading from '../../Loading';

const AdminSubjects = () => {
    const { course: currCourse, branch: currBranch, semester: currSemester } = useParams();
    const [semester, setSemester] = useState(currSemester || '');
    const [course, setCourse] = useState(currCourse || '');
    const [branch, setBranch] = useState(currBranch || '');



    const navigate = useNavigate();
    let parameters = getAllParameters()
    useEffect(() => {
        if (course && semester && branch) {
            navigate(`/admin/subjects/${course}/${branch}/${semester}`);
        }
    }, [course, branch, semester]);


    let currParmeter = parameters.filter(p => p.course == course)

    if (currCourse && currParmeter.length <= 0) {
        return (
            <Loading />
        )
    }
    return (
        <Container>
            <Link to=".." relative="path">
                <IconButton sx={{ mb: 2, display: "flex" }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="course-label" sx={{}}>Course</InputLabel>
                        <Select
                            labelId="course-label"
                            id="course-select"
                            value={course}
                            onChange={(e) => {
                                setSemester('');
                                setCourse(e.target.value);
                            }}
                            label="Course"
                        >
                            {parameters.map((p, index) => (
                                <MenuItem key={index} value={p.course}>{p.course}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="branch-label">Branch</InputLabel>
                        <Select
                            labelId="branch-label"
                            id="branch-select"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            label="Branch"
                        >
                            {currParmeter.length > 0 && currParmeter[0].branches.map((b, index) => (
                                <MenuItem value={b.name} key={index}>{b.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel id="semester-label">Semester</InputLabel>
                        <Select
                            labelId="semester-label"
                            id="semester-select"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            label="Semester"
                        >
                            {currParmeter.length > 0 && [...Array(Number(currParmeter[0].semesters))].map((_, index) => (
                                <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Outlet />
        </Container>
    );
}

export default AdminSubjects;
