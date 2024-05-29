import { Box, CircularProgress, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { fetchAllParameters, getParametersError } from '../../features/parametersSlice'
import { fetchAllSubjects, getSubjectsError } from '../../features/subjectsSlice'
import { fetchAllTeachers, fetchTeacher, getCurrTeacher, getTeachersError, getTeachersStatus } from '../../features/teachersSlice'
import ErrorComponent from '../ErrorComponent'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '../Loading'

const TeacherNav = () => {
    const dispatch = useDispatch()
    const status = getTeachersStatus()
    const teacher = getCurrTeacher()

    const [loading, setLoading] = useState(true)

    const subjError = getSubjectsError()
    const teacherError = getTeachersError()
    const parametersError = getParametersError()


    useEffect(() => {
        async function fetch() {
            await dispatch(fetchAllSubjects())
            await dispatch(fetchAllTeachers())
            await dispatch(fetchTeacher())
            await dispatch(fetchAllParameters())
            setLoading(false)
        }
        fetch()
    }, [])

    // console.log(status, 'teacher status');
    // console.log(subjError, teacherError, parametersError, teacher, 'teacher error');


    if (loading) {
        return (
            <Loading />
        );
    }


    return (
        <Box component="div">
            <Link to=".." relative="path">
                <IconButton sx={{ mb: 2, display: "flex" }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            {teacher && <Outlet context={teacher} />}
            {!teacher && <Navigate to={'/login'} />}
            {(subjError || teacherError || parametersError) && <ErrorComponent error={subjError || teacherError || parametersError} />}
        </Box>
    )
}

export default TeacherNav