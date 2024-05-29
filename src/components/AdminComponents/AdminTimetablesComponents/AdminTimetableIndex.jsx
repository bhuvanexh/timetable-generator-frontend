import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { getAllParameters } from '../../../features/parametersSlice'
import { getAllSubjects } from '../../../features/subjectsSlice'
import { getAllTeachers } from '../../../features/teachersSlice'
import { getAllTimetables } from '../../../features/timetablesSlice'
import { checkAllSubjectsAssigned } from '../../../util'
import ExceededClassesBox from './ExceededClassesBox'
import TimetablesComponent from './TimetablesComponent'
import UnassignedSubjectsInfoBox from './UnassignedSubjectsInfoBox'

const AdminTimetableIndex = () => {
    const { dataVerifiedFlag, exceededData } = useOutletContext()
    const timetables = getAllTimetables()
    const parameters = getAllParameters()
    const subjects = getAllSubjects()
    console.log(dataVerifiedFlag, subjects, timetables, 'hmmm');
    let checkArr = []
    if (timetables) {
        checkArr = checkAllSubjectsAssigned(timetables, subjects);
        console.log(checkArr, 'check arr new');
    }
    return (
        <>
            <Box>
                {
                    !dataVerifiedFlag && <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.6rem" }, fontStyle: "italic", textAlign: "center", marginBlock: 4 }}> **you need to verify all the data submitted by teachers first before generating timetables** </Typography>
                }
                {
                    dataVerifiedFlag && !timetables && <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.6rem" }, fontStyle: "italic", textAlign: "center", marginBlock: 4 }}> **Generate and approve timetables only after ensuring that teacher data has been completed and verified.** </Typography>
                }
                {
                    exceededData.length > 0 && <ExceededClassesBox exceededBatches={exceededData} />
                }
                {
                    checkArr.length > 0 && <UnassignedSubjectsInfoBox checkArr={checkArr} />
                }
                {dataVerifiedFlag && timetables && <TimetablesComponent timetables={timetables} parameters={parameters} />}
            </Box>
        </>
    )
}

export default AdminTimetableIndex