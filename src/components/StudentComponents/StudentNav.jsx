import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { fetchAllTimetables, getTimetableErrors, getTimetableStatus } from '../../features/timetablesSlice';
import { Box, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import { fetchAllParameters, getAllParameters, getParametersError } from '../../features/parametersSlice';
import ErrorComponent from '../ErrorComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '../Loading';

const StudentNav = () => {
    const { course: courseIni, branch: branchIni, semester: semesterIni, section: sectionIni } = useParams()
    const [semester, setSemester] = useState(semesterIni || "");
    const [branch, setBranch] = useState(branchIni || '');
    const [course, setCourse] = useState(courseIni || "");
    const [section, setSection] = useState(sectionIni || "");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const status = getTimetableStatus();
    const timtableError = getTimetableErrors()
    const parametersError = getParametersError()
    let parameters = getAllParameters()
    let currParmeter = parameters.filter(p => p.course == course)
    let currBranch = []
    if (currParmeter.length > 0) {
        currBranch = currParmeter[0].branches.filter(b => b.name == branch)
    }
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            await dispatch(fetchAllTimetables());
            await dispatch(fetchAllParameters());
            setLoading(false)
        }
        fetch()
    }, []);

    useEffect(() => {
        if (course && semester && branch && section) {
            navigate(`/student/${course}/${branch}/${semester}/${section}`);
        }
    }, [course, semester, branch, section]);

    if (loading) {
        return (
            <Loading />
        );
    }


    return (
        <><Box>
            <Link to=".." relative="path">
                <IconButton sx={{ mb: 2, display: "flex" }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <Grid container spacing={2} paddingBlock={3} justifyContent="center" alignItems="center" paddingInline={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="course-label">Course</InputLabel>
                        <Select
                            labelId="course-label"
                            id="course-select"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            label="Course"
                        >
                            {parameters.map((p, index) => (
                                <MenuItem key={index} value={p.course}>{p.course}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="branch-label">Branch</InputLabel>
                        <Select
                            labelId="branch-label"
                            id="branch-select"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            label="Branch"
                        >
                            {currParmeter.length > 0 && currParmeter[0].branches.map((b, index) => (
                                <MenuItem key={index} value={b.name}>{b.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl variant="outlined" fullWidth>
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
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="section-label">Section</InputLabel>
                        <Select
                            labelId="section-label"
                            id="section-select"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            label="Section"
                        >
                            {currParmeter.length > 0 && currBranch.length > 0 && [...Array(Number(currBranch[0].sections))].map((_, index) => (
                                <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Outlet />
        </Box>
            {(timtableError || parametersError) && <ErrorComponent error={timtableError || parametersError} />}
        </>
    );
};

export default StudentNav;
