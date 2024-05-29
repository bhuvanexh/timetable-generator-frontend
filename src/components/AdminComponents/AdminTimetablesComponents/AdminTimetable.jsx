import { Box, Button, Container, IconButton } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { addAllSchedules, getAllTeachers } from '../../../features/teachersSlice'
import { addAllTimetables } from '../../../features/timetablesSlice'
import { generateTimetables } from '../../../util'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAllParameters } from '../../../features/parametersSlice'
import SuccessComponent from '../../SuccessComponent'
import Loading from '../../Loading'

const AdminTimetable = () => {
    const teachers = getAllTeachers()
    const navigate = useNavigate()
    let dataVerifiedFlag = false
    dataVerifiedFlag = teachers.length > 0 && teachers?.every(t => t.dataVerified == true)
    const dispatch = useDispatch()
    const parameters = getAllParameters()

    const [successMsg, setSuccessMsg] = useState(null)
    const [exceededData, setExceededData] = useState([])
    const [loading, setloading] = useState(false)

    async function handleGenerate() {
        setloading(true)
        let timetablesData = generateTimetables(teachers, parameters)
        console.log(timetablesData, 'time tables data');
        if (!timetablesData.error) {

            let res = await dispatch(addAllTimetables(timetablesData.timetables))
            let res2 = await dispatch(addAllSchedules(timetablesData.teachersSchedules))
            setloading(false)
            if (res.meta.requestStatus == 'fulfilled' && res2.meta.requestStatus == 'fulfilled') {
                setSuccessMsg('timetables and schedules added')
            } else if (res.meta.requestStatus == 'rejected' && res2.meta.requestStatus == 'rejected') {
                setSuccessMsg(res.payload.message || "couldn't add timetables or schedules")
            }
        } else {
            setExceededData(timetablesData.maxClassesCheck)
        }
    }

    return (
        <Box>
            <Link to=".." relative="path">
                <IconButton sx={{ mb: 2, display: "flex" }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            {!loading ? <Container>
                <Box sx={{ display: "flex", justifyContent: "center", paddingBlock: { xs: 2, sm: 3, md: 4 }, marginBottom: 3 }}>
                    {dataVerifiedFlag && <Button variant='contained' sx={{ width: "220px", fontSize: "1rem" }} onClick={handleGenerate}>Generate Timetables</Button>}
                    {!dataVerifiedFlag && <Button variant='contained' sx={{ width: "180px", fontSize: "1rem" }} onClick={() => navigate('/admin/teachers/verify')}>Verify data</Button>}
                </Box>
                <Outlet context={{ dataVerifiedFlag, exceededData }} />
            </Container> : <Loading />}
            <SuccessComponent message={successMsg} />
        </Box>
    )
}

export default AdminTimetable