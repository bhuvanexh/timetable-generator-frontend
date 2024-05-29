import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { fetchAllParameters, getParametersError } from '../../features/parametersSlice'
import { fetchAllSubjects } from '../../features/subjectsSlice'
import { fetchAllTeachers, fetchTeacher, getCurrTeacher, getTeachersError, getTeachersStatus } from '../../features/teachersSlice'
import { fetchAllTimetables, getTimetableErrors } from '../../features/timetablesSlice'
import ErrorComponent from '../ErrorComponent'
import Loading from '../Loading'

const AdminNav = () => {
    const dispatch = useDispatch()
    const status = getTeachersStatus()
    const teacher = getCurrTeacher()

    const [loading, setLoading] = useState(true)

    let parametersError = getParametersError()
    let teachersError = getTeachersError()
    let subjectsError = getTeachersError()
    let timetablesError = getTimetableErrors()

    useEffect(() => {
        async function fetch() {
            await dispatch(fetchTeacher())
            await dispatch(fetchAllSubjects())
            await dispatch(fetchAllTeachers())
            await dispatch(fetchAllTimetables())
            await dispatch(fetchAllParameters())
            setLoading(false)
        }
        fetch()
    }, [])



    if (loading) {
        return (
            <Loading />
        );
    }

    console.log(teacher, status, 'admin nav');
    return (
        <Box>
            {teacher && teacher?.isAdmin && <Outlet context={teacher} />}
            {(!teacher || !teacher.isAdmin) && <Navigate to={'/login/admin'} />}
            {(parametersError || teachersError || subjectsError || timetablesError) && <ErrorComponent error={parametersError || teachersError || subjectsError || timetablesError} />}
        </Box>
    )
}

export default AdminNav