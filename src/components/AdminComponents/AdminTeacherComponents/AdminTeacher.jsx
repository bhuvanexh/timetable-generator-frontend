import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { addTeacherData, editTeacher, getAllTeachers, getTeacherById, getTeachersError, lockTeacherData } from '../../../features/teachersSlice'
import React, { useState } from 'react'
import { getSubjects, getSubjectsError } from '../../../features/subjectsSlice'
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { constraintCheckTeacherData } from '../../../util';
import TeacherDataTable from './TeacherDataTable';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { getAllParameters, getParametersError } from '../../../features/parametersSlice';
import ErrorComponent from '../../ErrorComponent';
import Loading from '../../Loading';
import SuccessComponent from '../../SuccessComponent';

const AdminTeacher = () => {
    let id = useParams().id
    let teacher
    let adminFlag = false
    if (id) {
        adminFlag = true
        teacher = getTeacherById(id)
    } else {
        teacher = useOutletContext().teacher
        id = useOutletContext().id
    }
    const [section, setSection] = useState('')
    const [semester, setSemester] = useState('')
    const [branch, setBranch] = useState('');
    const [course, setCourse] = useState('')
    const [subject, setSubject] = useState('')
    const [lectures, setLectures] = useState('')
    const [labs, setLabs] = useState('')
    const dispatch = useDispatch()
    const teachers = getAllTeachers()
    let parameters = getAllParameters()

    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    async function handleAddData() {
        let classCount = 0
        teacher.teacherData.forEach(data => {
            classCount += Number(data.lectures) + Number(data.labs)
        })

        let alreadySubjCheckArr = teacher.teacherData.filter(data => {
            return (data.subject == subject) && (data.course == course) && (data.semester == semester) && (data.section == section) && (data.branch == branch)
        })

        if (!subject || !semester || !course || !branch || !section || ((lectures == '0') && (labs == '0')) || lectures.length == 0 || labs.length == 0) {
            setError('complete entries')
            setTimeout(() => {
                setError('');
            }, 3000);
        }
        else if (alreadySubjCheckArr.length > 0) {
            setError('this class is already added')
            setTimeout(() => {
                setError('');
            }, 3000);
        }
        else if ((classCount + Number(labs) + Number(lectures)) > 24) {
            setError('teacher taking too many classes')
            setTimeout(() => {
                setError('');
            }, 3000);
        }
        else {
            let res = await dispatch(addTeacherData({
                id, data: {
                    id: uuidv4(),
                    course,
                    branch,
                    semester,
                    section,
                    subject,
                    lectures,
                    labs
                }
            }))

            if (res.meta.requestStatus == 'fulfilled') {
                setSuccessMsg('data added')
            } else if (res.meta.requestStatus == 'rejected') {
                setSuccessMsg(res.payload.message || "couldn't add data")
            }
        }
    }

    async function handleLock() {
        let res = await dispatch(lockTeacherData({ id, newData: { isLocked: true } }))
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('data locked')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't lock data")
        }
    }

    async function handleUnlock() {
        let res = await dispatch(lockTeacherData({ id, newData: { isLocked: false } }))
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('data unlocked')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't unlock data")
        }
    }


    async function handleVerify() {
        let res = await dispatch(editTeacher({ id, newData: { dataVerified: true } }))
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('data verified')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't verify")
        }
    }

    async function handleReject() {
        let res = await dispatch(editTeacher({ id, newData: { dataVerified: false } }))
        if (res.meta.requestStatus == 'fulfilled') {
            setSuccessMsg('data rejected')
        } else if (res.meta.requestStatus == 'rejected') {
            setSuccessMsg(res.payload.message || "couldn't reject")
        }
    }

    let currParmeter = parameters.filter(p => p.course == course)
    let currBranch = []
    if (currParmeter.length > 0) {
        currBranch = currParmeter[0].branches.filter(b => b.name == branch)
    }

    let subjects = getSubjects(course, branch, semester)


    return (
        <Box>
            {teacher ? (
                <Box sx={{ width: "95%", marginInline: "auto" }}>
                    <Typography sx={{ borderBottom: "1px solid black", width: "max-content", marginBlock: 2.5, fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" } }}>
                        Welcome {teacher.name}
                    </Typography>
                    {!teacher.isLocked && (
                        <>
                            <Box>
                                <Typography sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
                                    Data for {teacher.name}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", paddingBlock: 2, gap: 2, alignItems: "center", flexWrap: 'wrap', justifyContent: 'center' }}>
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel id="course-select-label" sx={{ zIndex: "1", bgcolor: "#E5E5E5", paddingX: '2px' }}>Course</InputLabel>
                                    <Select
                                        labelId="course-select-label"
                                        id="course-select"
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                    >
                                        {parameters.map((p, index) => (
                                            <MenuItem key={index} value={p.course}>{p.course}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{ minWidth: 140 }}>
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
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel id="semester-select-label" sx={{ zIndex: "1", bgcolor: "#E5E5E5", paddingX: '2px' }}>Semester</InputLabel>
                                    <Select
                                        labelId="semester-select-label"
                                        id="semester-select"
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                    >
                                        {currParmeter.length > 0 && [...Array(Number(currParmeter[0].semesters))].map((_, index) => (
                                            <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{ minWidth: 140 }}>
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
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel id="subject-select-label" sx={{ zIndex: "1", bgcolor: "#E5E5E5", paddingX: '2px' }}>Subject</InputLabel>
                                    <Select
                                        labelId="subject-select-label"
                                        id="subject-select"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    >
                                        {subjects.length > 0 && subjects[0].subjects.map((obj) => (
                                            <MenuItem key={obj.name} value={obj.name}>
                                                {obj.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel id="lectures-select-label" sx={{ zIndex: "1", bgcolor: "#E5E5E5", paddingX: '2px' }}>Lecture/week</InputLabel>
                                    <Select
                                        labelId="lectures-select-label"
                                        id="lectures-select"
                                        value={lectures}
                                        onChange={(e) => setLectures(e.target.value)}
                                    >
                                        {[0, 1, 2, 3, 4].map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel id="labs-select-label" sx={{ zIndex: "1", bgcolor: "#E5E5E5", paddingX: '2px' }}>Labs/week</InputLabel>
                                    <Select
                                        labelId="labs-select-label"
                                        id="labs-select"
                                        value={labs}
                                        onChange={(e) => setLabs(e.target.value)}
                                    >
                                        {[0, 1, 2, 3].map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button sx={{ minWidth: 140 }} variant='contained' onClick={handleAddData}>Add Data</Button>
                            </Box>
                            {error && <Box >
                                <Typography>
                                    {error}
                                </Typography>
                            </Box>}
                        </>
                    )}
                    <Box sx={{ marginTop: 3 }}>
                        <TeacherDataTable setSuccessMsg={setSuccessMsg} allTeachers={teachers} adminFlag={adminFlag} data={teacher.teacherData} teacherId={id} isLocked={teacher.isLocked} dataVerified={teacher.dataVerified} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 3, padding: 2, paddingBlock: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {!teacher.isLocked && <Button sx={{ width: '200px', fontSize: '14px' }} variant='contained' onClick={handleLock}>Submit and Lock Data</Button>}
                        {!teacher.dataVerified && teacher.isLocked && adminFlag && (
                            <Button sx={{ width: '200px', fontSize: '14px' }} variant='contained' onClick={handleUnlock}>Unlock Data and Edit</Button>
                        )}
                        {adminFlag && !teacher.dataVerified && (
                            <Button sx={{ width: '180px', fontSize: '14px' }} variant='contained' disabled={!teacher.isLocked} onClick={handleVerify}>
                                Verify Data
                            </Button>
                        )}
                        {adminFlag && teacher.dataVerified && (
                            <Button sx={{ width: '180px', fontSize: '14px' }} variant='contained' disabled={!teacher.isLocked} onClick={handleReject}>
                                Reject Data
                            </Button>
                        )}
                    </Box>
                </Box>
            ) : (
                <Loading />
            )}
            <SuccessComponent message={successMsg} />
        </Box>
    )
}

export default AdminTeacher